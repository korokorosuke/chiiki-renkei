import { createServerFn } from "@tanstack/solid-start"
import { ReferralToService } from "../domain/referraltoService.ts"
import { ReferralToRepository } from "../infra/allRepository.ts"
import type { ReferralTo } from "../domain/referralto.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

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
        const service = new ReferralToService(new ReferralToRepository(auth.user!.base));
        return await service.get(data.id);
      }
    }
    return undefined;
});

export const getReferralTos = createServerFn({ method: "GET" })
  .validator((data : {patientId: string}) => data)
  .handler(async ({ data }): Promise<ReferralTo[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.patientId){
        const service = new ReferralToService(new ReferralToRepository(auth.user!.base));
        return await service.getListByPatient(data.patientId);
      }
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {referral: ReferralTo}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ReferralToService(new ReferralToRepository(auth.user!.base));
      return await service.insert(data.referral);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {referral: ReferralTo}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ReferralToService(new ReferralToRepository(auth.user!.base));
      return await service.update(data.referral);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {referral: ReferralTo}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.referral){
        const service = new ReferralToService(new ReferralToRepository(auth.user!.base));
        await service.delete(data.referral);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});