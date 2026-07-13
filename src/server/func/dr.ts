import { createServerFn } from "@tanstack/solid-start"
import { DrService } from "../domain/drService.ts"
import { DrRepository } from "../infra/allRepository.ts"
import type { Dr } from "../domain/dr.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

const AUTH_READ = [
    {auth: Auth.APPOINT, role: Role.READ},
    {auth: Auth.REFERRAL, role: Role.READ},
    {auth: Auth.STATISTICS, role: Role.READ},
];
const AUTH_READ_ALL = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

async function getDrsForDeptMain(dept: string): Promise<Dr[]> {
  const auth = await authenticate(AUTH_READ);
  if(auth.ok){
    if(dept){
      const service = new DrService(new DrRepository(auth.user!.base));
      return await service.getList(dept);
    }
  }
  return [];
}

export const getDrsForDept = createServerFn({ method: "GET" })
  .validator((data : {dept: string}) => data)
  .handler(async ({ data }): Promise<Dr[]> => {
    return await getDrsForDeptMain(data.dept);
});

export const getDrs = createServerFn({ method: "GET" })
  .validator((data : {dept: string}) => data)
  .handler(async ({ data }): Promise<Dr[]> => {
    return await getDrsForDeptMain(data.dept);
});

export const getAllDrs = createServerFn({ method: "GET" })
  .handler(async (): Promise<Dr[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new DrService(new DrRepository(auth.user!.base));
      return await service.getAll();
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {dr: Dr}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new DrService(new DrRepository(auth.user!.base));
      return await service.insert(data.dr);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {dr: Dr}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new DrService(new DrRepository(auth.user!.base));
      return await service.update(data.dr);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {dr: Dr}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.dr){
        const service = new DrService(new DrRepository(auth.user!.base));
        await service.delete(data.dr);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});