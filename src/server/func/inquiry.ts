import { createServerFn } from "@tanstack/solid-start"
import { InquiryService } from "../domain/inquiryService.ts"
import { InquiryRepository } from "../infra/allRepository.ts"
import type { Inquiry } from "../domain/inquiry.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

const AUTH_READ = {auth: Auth.APPOINT, role: Role.READ};
const AUTH_WRITE = {auth: Auth.APPOINT, role: Role.WRITE};

export const getInquiries = createServerFn({ method: "GET" })
  .validator((data : {patientId?: string, facilityId?: string, fromDate?: string, toDate?: string}) => data)
  .handler(async ({ data }): Promise<Inquiry[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.patientId || data.facilityId || data.fromDate || data.toDate){
        const service = new InquiryService(new InquiryRepository(auth.user!.base));
        return await service.getList({patientId: data.patientId, facilityId: data.facilityId,
          fromDate: data.fromDate, toDate: data.toDate});
      }
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {inquiry: Inquiry}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new InquiryService(new InquiryRepository(auth.user!.base));
      return await service.insert(data.inquiry);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {inquiry: Inquiry}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new InquiryService(new InquiryRepository(auth.user!.base));
      return await service.update(data.inquiry);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {inquiry: Inquiry}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.inquiry){
        const service = new InquiryService(new InquiryRepository(auth.user!.base));
        await service.delete(data.inquiry);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});