import type { Statistics, Condition } from "./statistics.ts"
import type { Referral } from "./referral.ts"
import type { Appointment } from "./appointment.ts"
import type { ReferralTo } from "./referralto.ts"
import { toReferral } from "../lib/types.ts"

export interface IService<T>{
    getListByDate: (fromDate: string, toDate: string) => Promise<T[]>
}

export class StatisticsService{
    async getReferralList(cond: Condition, i: IService<Appointment>): Promise<Statistics<Referral[]>>{
        let ffac: (r:Appointment)=>boolean;
        let fdept: (r:Appointment)=>boolean;
        let fdr: (r:Appointment)=>boolean;
        const res = await i.getListByDate(
            cond.fromDate ?? "",
            cond.toDate ?? "");
        if(cond.facility){
            ffac = r=>r.facility!.id === cond.facility;
        }else{
            ffac = _=>true;
        }
        if(cond.dept){
            fdept = r=>r.department!.id === cond.dept;
        }else{
            fdept = _=>true;
        }
        if(cond.dr){
            fdr = r=>r.dr!.id === cond.dr;
        }else{
            fdr = _=>true;
        }
        return {result: res.filter(r=>ffac(r)&&fdept(r)&&fdr(r)).map(r=>toReferral(r))};
    }

    async getReferralToList(cond: Condition, i: IService<ReferralTo>): Promise<Statistics<ReferralTo[]>>{
        let ffac: (r:ReferralTo)=>boolean;
        let fdept: (r:ReferralTo)=>boolean;
        let fdr: (r:ReferralTo)=>boolean;
        const res = await i.getListByDate(
            cond.fromDate ?? "",
            cond.toDate ?? "");
        if(cond.facility){
            ffac = r=>r.facility!.id === cond.facility;
        }else{
            ffac = _=>true;
        }
        if(cond.dept){
            fdept = r=>r.department!.id === cond.dept;
        }else{
            fdept = _=>true;
        }
        if(cond.dr){
            fdr = r=>r.dr!.id === cond.dr;
        }else{
            fdr = _=>true;
        }
        return {result: res.filter(r=>ffac(r)&&fdept(r)&&fdr(r))};
    }

    async getReplyList(cond: Condition, i: IService<Referral>): Promise<Statistics<Referral[]>>{
        let ffac: (r:Referral)=>boolean;
        let fdept: (r:Referral)=>boolean;
        let fdr: (r:Referral)=>boolean;
        const res = await i.getListByDate(
            cond.fromDate ?? "",
            cond.toDate ?? "");
        if(cond.facility){
            ffac = r=>r.facility!.id === cond.facility;
        }else{
            ffac = _=>true;
        }
        if(cond.dept){
            fdept = r=>r.department!.id === cond.dept;
        }else{
            fdept = _=>true;
        }
        if(cond.dr){
            fdr = r=>r.dr!.id === cond.dr;
        }else{
            fdr = _=>true;
        }
        return {result: res.filter(r=>{
            return ffac(r)&&fdept(r)&&fdr(r)})};
    }
}