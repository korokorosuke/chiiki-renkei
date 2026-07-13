import { createServerFn } from "@tanstack/solid-start"
import { StatisticsService } from "../domain/statisticsService.ts"
import { AppointmentService } from "../domain/appointmentService.ts"
import { ReferralToService } from "../domain/referraltoService.ts"
import { ReplyListService } from "../domain/replyService.ts"
import { AppointmentRepository, ReplyRepository, ReferralToRepository } from "../infra/allRepository.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Condition, validate } from "../domain/statistics.ts"
import type { Referral } from "../domain/referral.ts"
import type { ReferralTo } from "../domain/referralto.ts"

const AUTH_READ = { auth: Auth.STATISTICS, role: Role.READ };

function getCondition(id: string, condition: Condition): Condition{
  const cond: Condition = {};
  if(id){
    if(condition.facility){
      cond.facility = condition.facility;
    }
    if(condition.dept){
      cond.dept = condition.dept;
    }
    if(condition.dr){
      cond.dr = condition.dr;
    }
    if(condition.fromDate){
      cond.fromDate = condition.fromDate;
    }
    if(condition.toDate){
      cond.toDate = condition.toDate;
    }
  }
  return cond;
}

export const getReferrals = createServerFn({ method: "GET" })
  .validator((data : {id: string, condition: Condition}) => data)
  .handler(async ({ data }): Promise<Referral[]> => {
    const auth = await authenticate(AUTH_READ);
    if(!auth.ok){
      return [];
    }
    const cond = getCondition(data.id, data.condition);
    if(!validate(cond).ok){
      return [];
    }
    const service = new StatisticsService();
    const refService = new AppointmentService(new AppointmentRepository(auth.user!.base));
    const d = await service.getReferralList(cond, refService);
    return d.result;
});

export const getReferralTos = createServerFn({ method: "GET" })
  .validator((data : {id: string, condition: Condition}) => data)
  .handler(async ({ data }): Promise<ReferralTo[]> => {
    const auth = await authenticate(AUTH_READ);
    if(!auth.ok){
      return [];
    }
    const cond = getCondition(data.id, data.condition);
    if(!validate(cond).ok){
      return [];
    }
    const service = new StatisticsService();
    const refToService = new ReferralToService(new ReferralToRepository(auth.user!.base));
    const d = await service.getReferralToList(cond, refToService);
    return d.result;
});

export const getReplies = createServerFn({ method: "GET" })
  .validator((data : {id: string, condition: Condition}) => data)
  .handler(async ({ data }): Promise<Referral[]> => {
    const auth = await authenticate(AUTH_READ);
    if(!auth.ok){
      return [];
    }
    const cond = getCondition(data.id, data.condition);
    if(!validate(cond).ok){
      return [];
    }
    const service = new StatisticsService();
    const replyService = new ReplyListService(new ReplyRepository(auth.user!.base));
    const d = await service.getReplyList(cond, replyService);
    return d.result;
});