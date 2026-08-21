import type { Appointment, Condition } from "../../../domain/appointment.ts"
import type { IAppointmentRepository } from "../../../domain/appointmentService.ts"
import { initializeDept } from "../../../domain/department.ts"
import { initialize as initializeDr } from "../../../domain/dr.ts"
import { Db } from "./dbSQLite.ts"
import { appointment } from "../../../db/schemaSQLite.ts"
import { type PatientDBResult, type FacilityDBResult, type UserDBResult, type DepartmentDBResult,
  toFacility, toUser, toPatient } from "../types.ts"
import { and, eq } from "drizzle-orm"
import { addDay } from "../../../lib/datetime.ts"

type AppointmentData = typeof appointment.$inferInsert;

type AppointmentDBResult = {
  id: string,
  date: string,
  time: string,
  patient: PatientDBResult | null,
  facility: FacilityDBResult | null,
  facilityDr: string,
  facilityDept: string,
  department: DepartmentDBResult | null,
  dr: {
    id: string,
    name: string,
    department: string,
  } | null,
  appDisplay: string,
  means: string,
  appointmentPersonInCharge: UserDBResult | null,
  memo: string,
  appointmentUpdatedBy: UserDBResult | null,
  updatedAt: string
}

export function toAppointment(val: AppointmentDBResult): Appointment {
  return {
    ...val,
    department: val.department ?? initializeDept(),
    dr: val.dr ?? initializeDr(),
    patient: toPatient(val.patient),
    facility: toFacility(val.facility),
    personInCharge: toUser(val.appointmentPersonInCharge),
    updatedBy: toUser(val.appointmentUpdatedBy),
  };
}

export class AppointmentRepository implements IAppointmentRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Appointment): AppointmentData {
    return {
      base: this.base,
      id: val.id,
      patientId: val.patient.id,
      date: val.date,
      time: val.time,
      facilityId: val.facility.id,
      facilityDr: val.facilityDr,
      facilityDept: val.facilityDept,
      departmentId: val.department.id,
      drId: val.dr.id,
      appDisplay: val.appDisplay,
      means: val.means,
      personInChargeId: val.personInCharge.id,
      memo: val.memo,
      updatedBy: val.updatedBy.id,
      updatedAt: val.updatedAt,
    };
  }
  fromData(val: AppointmentDBResult): Appointment {
    return toAppointment(val);
  }

  async insert(val: Appointment): Promise<boolean> {
    if(!val.patient){
      return false;
    }
    try{
      const db = await this.database.open();
      await db.insert(appointment).values(this.toData(val));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Appointment): Promise<boolean> {
    const data = await this.read(val.id);
    if(!data || !data.patient || !val.patient){
        return false;
    }
    try{
      const db = await this.database.open();
      await db.update(appointment).set(this.toData(val))
        .where(
          and(
            eq(appointment.base, this.base),
            eq(appointment.id, val.id),
          ));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Appointment): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(appointment)
        .where(
          and(
            eq(appointment.base, this.base),
            eq(appointment.id, val.id),
          ));
    }catch(e){
      console.log(e);
    }finally{
      this.database.close();
    }
  }

  private async select(cond: object): Promise<AppointmentDBResult[]> {
    const db = await this.database.open();
    return await db.query.appointment.findMany({
      columns: {
        id: true,
        date: true,
        time: true,
        facilityDr: true,
        facilityDept: true,
        appDisplay: true,
        means: true,
        memo: true,
        updatedAt: true,
      },
      with: {
        department: {
          columns: {
            id: true,
            name: true,
          },
        },
        dr: {
          columns: {
            id: true,
            name: true,
            department: true,
          },
        },
        patient: {
          columns: {
            base: false,
          }
        },
        facility: {
          columns: {
            id: true,
            name: true,
            tel: true,
            fax: true,
            addressName: true,
            addressPlus: true,
          },
        },
        appointmentPersonInCharge: {
          columns: {
            id: true,
            name: true,
            departmentId: true,
          }
        },
        appointmentUpdatedBy: {
          columns: {
            id: true,
            name: true,
            departmentId: true,
          }
        },
      },
      where: cond,
      orderBy: {
        date: "desc"
      },
    });
  }

  async read(id: string): Promise<Appointment|undefined> {
    const res = await this.select({base: this.base, id: id});
    if(res.length > 0){
      return this.fromData(res[0]);
    }
    return undefined;
  }

  private buildCondition(cond: Condition): object {
    let conditions: object = {base: this.base};
    if(cond.patientId){
      conditions = {...conditions, patientId: cond.patientId};
    }
    let fromDate, toDate;
    if(cond.fromDate){
      fromDate = cond.fromDate;
    }else{
      fromDate = "1900-01-01";
    }
    if(cond.toDate){
      toDate = addDay(cond.toDate);
    }else{
      toDate = "2999-12-31";
    }
    conditions = {...conditions, AND: [
      {
        date:{gte: fromDate}
      },
      {
        date:{lt: toDate}
      }
    ]};
    return conditions;
  }

  async list(cond: Condition): Promise<Appointment[]> {
    const res = await this.select(this.buildCondition(cond));
    const list: Appointment[] = [];
    for await (const r of res){
      list.push(this.fromData(r));
    }
    return list;
  }

  async listForReport(date: string, facilityId?: string, deptId?: string): Promise<Appointment[]> {
    const cond: {base: string; date: string; facilityId?: string; departmentId?: string;
      facility: {notSend: boolean}} = {base: this.base, date: date, facility: {notSend: false}};
    if(facilityId){
      cond.facilityId = facilityId;
    }
    if(deptId){
      cond.departmentId = deptId;
    }
    const res = await this.select(cond);
    const list: Appointment[] = [];
    for await (const r of res){
      if(r.facility && r.facility.faxSendNo){
        r.facility.fax = r.facility.faxSendNo;
      }
      list.push(this.fromData(r));
    }
    return list;
  }
}