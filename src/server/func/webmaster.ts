import { createServerFn } from "@tanstack/solid-start"
import { WebMasterService } from "../domain/webMasterService.ts"
import { WebMasterRepository } from "../infra/allRepository.ts"
import type { WebMaster } from "../domain/webMaster.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type FetchResult, type Result, ng } from "../lib/response.ts"

const AUTH_READ = {auth: Auth.WEB, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getWebMaster = createServerFn({ method: "GET" })
  .validator((data : {dept: string, dr: string, week: number}) => data)
  .handler(async ({ data }): Promise<FetchResult<WebMaster>> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      const service = new WebMasterService(new WebMasterRepository(auth.user!.base));
      const master = await service.get(data.dept, data.dr, data.week);
      if(master){
        return {ok: true, data: master};
      }else{
        return ng(["データが存在しません。"]);
      }
    }
    return ng(auth.errors!);
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {master: WebMaster}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebMasterService(new WebMasterRepository(auth.user!.base));
      await service.delete(data.master);
      return await service.insert(data.master);
    }
    return ng(auth.errors!);
});

export const update = insert;

export const del = createServerFn({ method: "POST" })
  .validator((data : {master: WebMaster}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebMasterService(new WebMasterRepository(auth.user!.base));
      return await service.delete(data.master);
    }
    return ng(auth.errors!);
});