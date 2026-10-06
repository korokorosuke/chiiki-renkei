import { createServerFn } from "@tanstack/solid-start"
import { redirect } from "@tanstack/solid-router"
import { InquiryService } from "../domain/inquiryService.ts"
import { InquiryRepository } from "../infra/allRepository.ts"
import type { Inquiry } from "../domain/inquiry.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

const AUTH_READ = {auth: Auth.APPOINT, role: Role.READ};
const AUTH_WRITE = {auth: Auth.APPOINT, role: Role.WRITE};

export const getInquiries = createServerFn({ method: "GET" })
  .validator((data : {patientId?: string, facilityId?: string, fromDate?: string, toDate?: string}) => data)
  .handler(async ({ data }): Promise<Inquiry[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.patientId || data.facilityId || data.fromDate || data.toDate){
        const service = new InquiryService(new InquiryRepository(auth.user.base));
        return await service.getList({patientId: data.patientId, facilityId: data.facilityId,
          fromDate: data.fromDate, toDate: data.toDate});
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
  .validator((data : {inquiry: Inquiry}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new InquiryService(new InquiryRepository(auth.user.base));
        return await service.insert(data.inquiry);
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
  .validator((data : {inquiry: Inquiry}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new InquiryService(new InquiryRepository(auth.user.base));
        return await service.update(data.inquiry);
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
  .validator((data : {inquiry: Inquiry}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new InquiryService(new InquiryRepository(auth.user.base));
        return await service.delete(data.inquiry);
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