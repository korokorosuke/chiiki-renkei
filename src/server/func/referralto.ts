import { createServerFn } from "@tanstack/solid-start"
import { redirect } from "@tanstack/solid-router"
import { ReferralToService } from "../domain/referraltoService.ts"
import { ReferralToRepository } from "../infra/allRepository.ts"
import type { ReferralTo } from "../domain/referralto.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

const AUTH_READ = [
  {auth: Auth.APPOINT, role: Role.READ},
  {auth: Auth.REFERRAL, role: Role.READ},
];
const AUTH_WRITE = [
  {auth: Auth.APPOINT, role: Role.WRITE},
  {auth: Auth.REFERRAL, role: Role.WRITE},
];

export const getReferralTo = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<ReferralTo|undefined> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.id){
        const service = new ReferralToService(new ReferralToRepository(auth.user.base));
        return await service.get(data.id);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
    return undefined;
});

export const getReferralTos = createServerFn({ method: "GET" })
  .validator((data : {patientId: string}) => data)
  .handler(async ({ data }): Promise<ReferralTo[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.patientId){
        const service = new ReferralToService(new ReferralToRepository(auth.user.base));
        return await service.getListByPatient(data.patientId);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {referralTo: ReferralTo}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new ReferralToService(new ReferralToRepository(auth.user.base));
        return await service.insert(data.referralTo);
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

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {referralTo: ReferralTo}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new ReferralToService(new ReferralToRepository(auth.user.base));
        return await service.update(data.referralTo);
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

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {referralTo: ReferralTo}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new ReferralToService(new ReferralToRepository(auth.user.base));
        return await service.delete(data.referralTo);
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