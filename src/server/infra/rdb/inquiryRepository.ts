import type { Inquiry, Condition } from "../../domain/inquiry.ts"
import type { IInquiryRepository } from "../../domain/inquiryService.ts"
import { initialize as initializeDue } from "../../domain/due.ts"
import { initialize as initializePatient } from "../../domain/patient.ts"
import { Db } from "./db.ts"
import { inquiry, response } from "../../db/schema.ts"
import { type PatientDBResult, type FacilityDBResult, type UserDBResult,
  toFacility, toUser, toPatient } from "./types.ts"
import { and, eq } from "drizzle-orm"
import { addDay } from "../../lib/datetime.ts"

type InquiryData = typeof inquiry.$inferInsert;

type InquiryDBResult = {
  id: string,
  patientInfo: string,
  patient: PatientDBResult | null,
  facility: FacilityDBResult | null,
  facilityStaff: string,
  user: UserDBResult | null,
  tel: string,
  datetime: string,
  due: {
    id: number,
    name: string,
    days: number,
  } | null,
  details: string,
  done: number,
  responses: {
    responder: UserDBResult | null,
    datetime: string,
    details: string,
  }[] | null,
}

export class InquiryRepository implements IInquiryRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Inquiry): InquiryData {
    return {
      base: this.base,
      id: val.id,
      patientInfo: val.patient.id,
      facilityId: val.facility.id,
      facilityStaff: val.facilityStaff,
      tel: val.tel,
      datetime: val.datetime,
      dueId: val.due.id,
      details: val.details,
      done: val.done ? 1 : 0,
      personInChargeId: val.personInCharge.id,
    };
  }
  toDataWithoutKey(val: Inquiry): Partial<InquiryData> {
    // deno-lint-ignore no-unused-vars
    const {base, id, ...etc} = this.toData(val);
    return etc;
  }
  fromData(val: InquiryDBResult): Inquiry {
    return {
      id: val.id,
      tel: val.tel,
      datetime: val.datetime,
      facilityStaff: val.facilityStaff,
      details: val.details,
      done: val.done === 1 ? true : false,
      patient: val.patient ? toPatient(val.patient) : {...initializePatient(), id: val.patientInfo},
      facility: toFacility(val.facility),
      due: val.due ?? initializeDue(),
      responses: val.responses ? val.responses.map(r => ({
        responder: toUser(r.responder),
        datetime: r.datetime,
        details: r.details,
      })) : [],
      personInCharge: toUser(val.user),
    };
  }

  async insert(val: Inquiry): Promise<boolean> {
    const db = await this.database.open();
    const res: number = await db.transaction(async (tx) => {
      const res1 = (await tx.insert(inquiry).values(this.toData(val))).rowsAffected;
      if(res1 >= 1){
        if(val.responses.length > 0){
          const res2 = (await tx.insert(response)
            .values(val.responses.map(r => ({
              base: this.base,
              inquiryId: val.id,
              responderId: r.responder.id,
              datetime: r.datetime,
              details: r.details,
            })))).rowsAffected;
          if(res2 === 0){
            tx.rollback();
            return 0;
          }
        }
        return res1;
      }
      tx.rollback()
      return 0;
    });
    return res >= 1;
  }

  async update(val: Inquiry): Promise<boolean> {
    const db = await this.database.open();
    const res = await db.transaction(async (tx) => {
      const res1 = (await tx.update(inquiry).set(this.toDataWithoutKey(val))
        .where(
          and(
            eq(inquiry.base, this.base),
            eq(inquiry.id, val.id),
          ))).rowsAffected;
      if(res1 >= 1){
        await tx.delete(response).where(eq(response.inquiryId, val.id));
        if(val.responses.length > 0){
          const res2 = (await tx.insert(response)
            .values(val.responses.map(r => ({
              base: this.base,
              inquiryId: val.id,
              responderId: r.responder.id,
              datetime: r.datetime,
              details: r.details,
            })))).rowsAffected;
          if(res2 === 0){
            tx.rollback();
            return 0;
          }
        }
        return res1;
      }
      tx.rollback()
      return 0;
    });
    return res >= 1;
  }

  async delete(val: Inquiry): Promise<void> {
    const db = await this.database.open();
    await db.transaction(async (tx) => {
      await tx.delete(response).where(
          eq(response.inquiryId, val.id),
        );
      (await tx.delete(inquiry)
        .where(
          and(
            eq(inquiry.base, this.base),
            eq(inquiry.id, val.id),
          ))).rowsAffected;
    });
  }

  async select(cond: object): Promise<InquiryDBResult[]> {
    const db = await this.database.open();
    return await db.query.inquiry.findMany({
      columns: {
        id: true,
        patientInfo: true,
        facilityStaff: true,
        tel: true,
        datetime: true,
        details: true,
        done: true,
      },
      with: {
        patient: {
          columns: {
            base: false,
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
        user: {
          columns: {
            id: true,
            name: true,
            departmentId: true,
          }
        },
        due: {
          columns: {
            id: true,
            name: true,
            days: true,
          }
        },
        responses: {
          columns: {
            datetime: true,
            details: true,
          },
          with: {
            responder: {
              columns: {
                id: true,
                name: true,
                departmentId: true,
              }
            }
          }
        }
      },
      where: cond,
      orderBy:{
        datetime: "desc",
      }
    });
  }

  async read(id: string): Promise<Inquiry|undefined> {
      const res = await this.select({id: id});
      if(res.length > 0){
        return this.fromData(res[0]);
      }
      return undefined;
  }

  private buildCondition(cond: Condition): object {
    let conditions: object = {base: this.base};
    if(cond.patientId){
      conditions = {...conditions, patientInfo: cond.patientId};
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
        datetime:{gte: fromDate}
      },
      {
        datetime:{lt: toDate}
      }
    ]};
    return conditions;
  }

  async list(cond: Condition): Promise<Inquiry[]> {
    const condition = this.buildCondition(cond);
    const res = await this.select(condition);
    if(res.length > 0){
      return res.map((val) => this.fromData(val));
    }
    return [];
  }
}