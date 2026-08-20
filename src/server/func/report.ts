import { createServerFn } from "@tanstack/solid-start"
import { ReportService } from "../domain/reportService.ts"
import { AppointmentService } from "../domain/appointmentService.ts"
import { AppointmentRepository } from "../infra/allRepository.ts"
import { FacilityService } from "../domain/facilityService.ts"
import { FacilityRepository } from "../infra/allRepository.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Condition, validate } from "../domain/report.ts"
import type { Facility } from "../domain/facility.ts"
import type { Appointment } from "../domain/appointment.ts"

const AUTH_READ = { auth: Auth.REFERRAL, role: Role.WRITE };

export interface AppointmentPrint extends Appointment {
  notPrint: boolean;
}

export const getAppointments = createServerFn({ method: "GET" })
  .validator((data : {condition: Condition}) => data)
  .handler(async ({ data }): Promise<AppointmentPrint[]> => {
    const auth = await authenticate(AUTH_READ);
    if(!auth.ok){
      return [];
    }
    if(!validate(data.condition).ok){
      return [];
    }
    const service = new ReportService();
    const refService = new AppointmentService(new AppointmentRepository(auth.user!.base));
    const facService = new FacilityService(new FacilityRepository(auth.user!.base));
    const d = await service.getAppointmentList(data.condition, refService);
    const m = new Map<string, Facility|undefined>();
    const list: AppointmentPrint[] = [];
    for(const item of d){
      const t = { ...item, notPrint: false };
      let f: Facility | undefined;
      if(m.has(t.facility.id)){
        f = m.get(t.facility.id);
      }else{
        f = await facService.get(t.facility.id);
        m.set(t.facility.id, f)
      }
      if(f){
        if(f.notSend){
          break;
        }else if(f.faxSendNo){
          t.facility.fax = f.faxSendNo;
        }
      }
      list.push(t);
    }
    return list;
});