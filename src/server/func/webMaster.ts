import { createServerFn } from "@tanstack/solid-start"
import { redirect } from "@tanstack/solid-router"
import { WebMasterService } from "../domain/webMasterService.ts"
import { WebMasterRepository } from "../infra/allRepository.ts"
import type { WebMaster } from "../domain/webMaster.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type FetchResult, type Result, okWithData, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

const AUTH_READ = {auth: Auth.WEB, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getWebMaster = createServerFn({ method: "GET" })
  .validator((data : {dept: string, dr: string, week: number}) => data)
  .handler(async ({ data }): Promise<FetchResult<WebMaster>> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      const service = new WebMasterService(new WebMasterRepository(auth.user.base));
      const master = await service.get(data.dept, data.dr, data.week);
      if(master){
        return okWithData(master);
      }else{
        return ng(["データが存在しません。"]);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {master: WebMaster}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new WebMasterService(new WebMasterRepository(auth.user.base));
        await service.delete(data.master);
        return await service.insert(data.master);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const update = insert;

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {master: WebMaster}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new WebMasterService(new WebMasterRepository(auth.user.base));
        return await service.delete(data.master);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});