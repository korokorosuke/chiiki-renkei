import type { WebAppointment, Condition } from "../../domain/webAppointment.ts"
import type { IWebAppRepository } from "../../domain/webAppointmentService.ts"
import { initialize as initializePatient } from "../../domain/patient.ts"
import { initialize as initializeDept } from "../../domain/webDepartment.ts"
import { initialize as initializeDr } from "../../domain/webDr.ts"
import { Db } from "./db.ts"
import { WebReservationRepository } from "./webReservationRepository.ts"
import { DATE_EMPTY } from "../../domain/webAppointmentService.ts"
import { webAppointment, webConsultation, webPatient } from "../../db/schema.ts"
import { type FacilityDBResult, type UserDBResult, toFacility, toUser } from "./types.ts"
import { and, eq } from "drizzle-orm"
import { addDay } from "../../lib/datetime.ts"

type WebAppointmentData = typeof webAppointment.$inferInsert;
type WebPatientData = typeof webPatient.$inferInsert;

type WebAppointmentDBResult = {
  id: string,
  webPatient: {
    id: string,
    lastName: string,
    firstName: string,
    lastKana: string,
    firstKana: string,
    sex: number,
    birthday: string,
    tel: string,
    tel2: string,
    memo: string,
    postalCode: string,
    addressName: string,
    addressPlus: string,
  } | null,
  date: string,
  time: string,
  facility: FacilityDBResult | null,
  webDepartment: {
    id: string,
    name: string,
    description: string,
  } | null,
  webDr: {
    id: string,
    name: string,
    displayName: string,
    department: string,
  } | null,
  webConsultation: {
    first: string,
    second: string,
    etc: string
  } | null,
  facPatientId: string,
  mainComplaint: string,
  cancel: boolean,
  force: boolean,
  webAppointmentCreatedBy: UserDBResult | null,
  createdAt: string,
  webAppointmentUpdatedBy: UserDBResult | null,
  updatedAt: string,
  createdAtString?: string,
  updatedAtString?: string,
}

export class WebAppRepository implements IWebAppRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: WebAppointment): WebAppointmentData{
    return {
      base: this.base,
      id: val.id,
      date: val.date,
      time: val.time,
      facilityId: val.facility.id,
      departmentId: val.department.id,
      drId: val.dr.id,
      facPatientId: val.facPatientId,
      mainComplaint: val.mainComplaint,
      cancel: val.cancel,
      force: val.force ? true : false,
      createdBy: val.createdBy.id,
      createdAt: val.createdAt,
      updatedBy: val.updatedBy.id,
      updatedAt: val.updatedAt,
    };
  }
  toPatientData(val: WebAppointment): WebPatientData {
    return {
      appointmentId: val.id,
      id: val.patient.id,
      lastName: val.patient.lastName,
      firstName: val.patient.firstName,
      lastKana: val.patient.lastKana,
      firstKana: val.patient.firstKana,
      sex: val.patient.sex,
      birthday: val.patient.birthday,
      tel: val.patient.tel,
      tel2: val.patient.tel2,
      memo: val.patient.memo,
      postalCode: val.patient.address.postalCode,
      addressName: val.patient.address.name,
      addressPlus: val.patient.address.plus,
    }
  }
  toDataWithoutKey(val: WebAppointment): Partial<WebAppointmentData> {
    // deno-lint-ignore no-unused-vars
    const {base, id, ...etc} = this.toData(val);
    return etc;
  }
  fromData(val: WebAppointmentDBResult): WebAppointment {
    return {
      id: val.id,
      date: val.date,
      time: val.time,
      patient: val.webPatient ? {
        id: val.webPatient.id,
        lastName: val.webPatient.lastName,
        firstName: val.webPatient.firstName,
        lastKana: val.webPatient.lastKana,
        firstKana: val.webPatient.firstKana,
        sex: val.webPatient.sex,
        birthday: val.webPatient.birthday,
        tel: val.webPatient.tel,
        tel2: val.webPatient.tel2,
        memo: val.webPatient.memo,
        address: {
          postalCode: val.webPatient.postalCode,
          name: val.webPatient.addressName,
          plus: val.webPatient.addressPlus,
        }
      } : {
        ...initializePatient(),
        lastKana: "",
        firstKana: "",
      },
      facility: toFacility(val.facility),
      department: val.webDepartment ?? initializeDept(),
      dr: val.webDr ?? initializeDr(),
      facPatientId: val.facPatientId,
      mainComplaint: val.mainComplaint,
      cancel: val.cancel ? true : false,
      consultation: val.webConsultation ?? undefined,
      force: val.force ? true : false,
      createdBy: toUser(val.webAppointmentCreatedBy),
      createdAt: val.createdAtString!,
      updatedBy: toUser(val.webAppointmentCreatedBy),
      updatedAt: val.updatedAtString!,
    };
  }

  async insert(val: WebAppointment): Promise<boolean> {
    if(!val.facility.id){
      return false;
    }
    const repo = new WebReservationRepository(this.base);
    if(val.date === DATE_EMPTY || await repo.countUp(val.department.id, val.date, val.dr.id, val.time, false)){
      const db = await this.database.open();
      const res = await db.transaction(async (tx) => {
        try{
          await tx.insert(webAppointment).values(this.toData(val));
          await tx.insert(webPatient).values(this.toPatientData(val));
          if(val.consultation){
            await tx.insert(webConsultation)
              .values({
                appointmentId: val.id,
                first: val.consultation.first,
                second: val.consultation.second,
                etc: val.consultation.etc,
              });
          }
          return true;
        }catch(e){
          console.log(e);
          return false;
        }
      });
      this.database.close();
      if(res){
        return true;
      }else {
        if(val.date !== DATE_EMPTY){
          await repo.countDown(val.department.id, val.date, val.dr.id, val.time);
        }
        return false;
      }
    }
    return false;
  }

  async update(val: WebAppointment): Promise<boolean> {
    const data = await this.read(val.id);
    if(!data || !data.facility.id || !val.facility.id){
      return false;
    }

    let countDownResult = false;
    if(data.department.id != val.department.id || data.date != val.date ||
        data.dr.id != val.dr.id || data.time != val.time){
      const repo = new WebReservationRepository(this.base);
      if(data.date !== DATE_EMPTY){
        if(await repo.countDown(data.department.id, data.date, data.dr.id, data.time)){
          countDownResult = true;
        }else{
          return false;
        }
      }
      if(val.date !== DATE_EMPTY){
        if(!await repo.countUp(val.department.id, val.date, val.dr.id, val.time, val.force)){
          if(countDownResult){
            await repo.countUp(data.department.id, data.date, data.dr.id, data.time, true);
          }
          return false;
        }
      }
    }

    const db = await this.database.open();
    const res = await db.transaction(async (tx) => {
      try{
        await tx.update(webAppointment).set(this.toDataWithoutKey(val))
          .where(eq(webAppointment.id, val.id));
        await tx.update(webPatient).set(this.toPatientData(val))
          .where(eq(webPatient.appointmentId, val.id));
        if(val.consultation){
          await tx.insert(webConsultation)
            .values({
              appointmentId: val.id,
              first: val.consultation.first,
              second: val.consultation.second,
              etc: val.consultation.etc,
            })
            .onConflictDoUpdate({
              target: webConsultation.appointmentId,
              set: {
                first: val.consultation.first,
                second: val.consultation.second,
                etc: val.consultation.etc,
              },
            });
        }else{
          await tx.delete(webConsultation).where(eq(webConsultation.appointmentId, val.id));
        }
        return true;
      }catch(e){
        console.log(e);
        return false;
      }
    });
    this.database.close();
    return res;
  }

  async delete(val: WebAppointment): Promise<void> {
    const data = await this.read(val.id);
    if(data){
      if(!data.cancel && data.date !== DATE_EMPTY && data.dr.id){
        const repo = new WebReservationRepository(this.base);
        if(!await repo.countDown(data.department.id, data.date, data.dr.id, data.time)){
          return;
        }
      }

      const db = await this.database.open();
      await db.transaction(async (tx) => {
        try{
          await tx.delete(webPatient)
            .where(
              eq(webPatient.appointmentId, val.id));
          await tx.delete(webConsultation)
            .where(
              eq(webConsultation.appointmentId, val.id));
          await tx.delete(webAppointment).where(
            and(
              eq(webAppointment.base, this.base),
              eq(webAppointment.id, val.id),
            ));
        }catch(e){
          console.log(e);
        }
      });
      this.database.close();
    }
  }

  private async select(cond: object): Promise<WebAppointmentDBResult[]> {
    const db = await this.database.open();
    return await db.query.webAppointment.findMany({
      columns: {
        id: true,
        date: true,
        time: true,
        facPatientId: true,
        mainComplaint: true,
        cancel: true,
        force: true,
        createdAt: true,
        updatedAt: true,
      },
      extras: {
        createdAtString: (record, { sql }) => sql<string>`to_char(${record.createdAt}, 'YYYY-MM-DD"T"HH24:MI:SS')`,
        updatedAtString: (record, { sql }) => sql<string>`to_char(${record.updatedAt}, 'YYYY-MM-DD"T"HH24:MI:SS')`,
      },
      with: {
        webConsultation: {
          columns: {
            appointmentId: false,
          }
        },
        webDepartment: {
          columns: {
            base: false,
          },
        },
        webDr: {
          columns: {
            base: false,
          },
        },
        webPatient: {
          columns: {
            appointmentId: false,
          },
        },
        facility: {
          columns: {
            id: true,
            name: true,
            tel: true,
            fax: true,
            postalCode: true,
            addressName: true,
            addressPlus: true,
          },
        },
        webAppointmentCreatedBy: {
          columns: {
            id: true,
            name: true,
            departmentId: true,
          }
        },
        webAppointmentUpdatedBy: {
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

  async read(id: string): Promise<WebAppointment|undefined> {
    const res = await this.select({base: this.base, id: id});
    if(res.length > 0){
      return this.fromData(res[0]);
    }
    return undefined;
  }

  private buildCondition(cond: Condition): object {
    let conditions: object = {base: this.base};
    if(cond.patientId){
      conditions = {...conditions, webPatient: {id: cond.patientId }};
    }
    if(cond.facilityId){
      conditions = {...conditions, facilityId: cond.facilityId};
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

  async list(cond: Condition): Promise<WebAppointment[]> {
    const res = await this.select(this.buildCondition(cond));
    return res.map(this.fromData);
  }
}