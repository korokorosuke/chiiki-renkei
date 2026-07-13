import { createServerFn } from "@tanstack/solid-start"
import { MasterService } from "../domain/masterService.ts"
import { MasterRepository } from "../infra/allRepository.ts"
import type { Master } from "../domain/master.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

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
      const service = new MasterService(new MasterRepository(auth.user!.base));
      const res = await service.get(id);
      if(res){
        return res;
      }
    }
  }
  return [];
}

export const update = createServerFn({ method: "POST" })
  .validator((data : {master: Master}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new MasterService(new MasterRepository(auth.user!.base));
      if(await service.update(data.master)){
        return ok();
      }else{
        return ng(["登録に失敗しました。"]);
      }
    }
    return ng(auth.errors!);
});