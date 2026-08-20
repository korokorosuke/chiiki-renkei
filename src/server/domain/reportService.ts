import { type Condition, validate } from "./report.ts"
import type { Appointment } from "./appointment.ts"

export interface IService<T>{
  getListByDate: (fromDate: string, toDate: string) => Promise<T[]>
}

export class ReportService{
  async getAppointmentList(cond: Condition, i: IService<Appointment>): Promise<Appointment[]>{
    const res = validate(cond);
    if(!res.ok){
      return [];
    }

    let ffac: (r:Appointment)=>boolean;
    let fdept: (r:Appointment)=>boolean;
    const result = await i.getListByDate(cond.date, cond.date);
    if(cond.facilityId){
      ffac = r=>r.facility!.id === cond.facilityId;
    }else{
      ffac = _=>true;
    }
    if(cond.deptId){
      fdept = r=>r.department!.id === cond.deptId;
    }else{
      fdept = _=>true;
    }
    return result.filter(r=>ffac(r)&&fdept(r));
  }
}