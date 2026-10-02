import { createServerFn } from "@tanstack/solid-start"
import { MasterService } from "../domain/masterService.ts"
import { MasterRepository } from "../infra/allRepository.ts"
import type { Master } from "../domain/master.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

const AUTH_READ = [
  {auth: Auth.APPOINT, role: Role.WRITE},
  {auth: Auth.REFERRAL, role: Role.WRITE},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getPurposes = createServerFn({ method: "GET" })
  .handler(async (): Promise<string[]> => {
    return await getMasterMain("purpose");
});

export const getMeans = createServerFn({ method: "GET" })
  .handler(async (): Promise<string[]> => {
    return await getMasterMain("means");
});

export const getFacDepts = createServerFn({ method: "GET" })
  .handler(async (): Promise<string[]> => {
    return await getMasterMain("facdept");
});

export const getClasses = createServerFn({ method: "GET" })
  .handler(async (): Promise<string[]> => {
    return await getMasterMain("class");
});

export const getPosts = createServerFn({ method: "GET" })
  .handler(async (): Promise<string[]> => {
    return await getMasterMain("post");
});

export const getKinds = createServerFn({ method: "GET" })
  .handler(async (): Promise<string[]> => {
    return await getMasterMain("kind");
});

export const getMaster = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<string[]> => {
    return await getMasterMain(data.id);
});

async function getMasterMain(id: string): Promise<string[]> {
  const auth = await authenticate(AUTH_READ);
  if(auth.ok){
    if(id){
      const service = new MasterService(new MasterRepository(auth.user.base));
      const res = await service.get(id);
      if(res){
        return res;
      }
    }
  }
  return [];
}

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {master: Master}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new MasterService(new MasterRepository(auth.user.base));
        return await service.update(data.master);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }
    return ng(auth.errors!);
});