import { type Condition, validate } from "./report.ts"
import type { Appointment } from "./appointment.ts"

export interface IService<T>{
  getListForReport: (date: string, facilityId?: string, deptId?: string) => Promise<T[]>
}

export class ReportService{
  async getAppointmentList(cond: Condition, i: IService<Appointment>): Promise<Appointment[]>{
    const res = validate(cond);
    if(!res.ok){
      return [];
    }

    return await i.getListForReport(cond.date, cond.facilityId, cond.deptId);
  }
}