import type { ReferralTo, Condition } from "../../domain/referralto.ts"
import type { IReferralToRepository } from "../../domain/referraltoService.ts"
import { initializeDept } from "../../domain/department.ts"
import { initialize as initializeDr } from "../../domain/dr.ts"
import { Db } from "./db.ts"
import { referralTo } from "../../db/schema.ts"
import { type PatientDBResult, type FacilityDBResult, type UserDBResult, type DepartmentDBResult,
  toFacility, toUser, toPatient } from "./types.ts"
import { and, eq } from "drizzle-orm"
import { addDay } from "../../lib/datetime.ts"
import { LogService } from "../../domain/logService.ts"
import { LogRepository } from "./logRepository.ts"

type ReferralToData = typeof referralTo.$inferInsert;

type ReferralToDBResult = {
  id: string,
  date: string,
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
  referralToPersonInCharge: UserDBResult | null,
  memo: string,
  referralToUpdatedBy: UserDBResult | null,
  updatedAt: string,
  updatedAtString?: string
}

export class ReferralToRepository implements IReferralToRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: ReferralTo): ReferralToData {
    return {
      base: this.base,
      id: val.id,
      patientId: val.patient.id,
      date: val.date,
      facilityId: val.facility.id,
      facilityDr: val.facilityDr,
      facilityDept: val.facilityDept,
      departmentId: val.department.id,
      drId: val.dr.id,
      personInChargeId: val.personInCharge.id,
      memo: val.memo,
      updatedBy: val.updatedBy.id,
      updatedAt: val.updatedAt,
    };
  }
  fromData(val: ReferralToDBResult): ReferralTo {
    return {
      id: val.id,
      date: val.date,
      facilityDr: val.facilityDr,
      facilityDept: val.facilityDept,
      memo: val.memo,
      department: val.department ?? initializeDept(),
      dr: val.dr ?? initializeDr(),
      patient: toPatient(val.patient),
      facility: toFacility(val.facility),
      personInCharge: toUser(val.referralToPersonInCharge),
      updatedAt: val.updatedAtString!,
      updatedBy: toUser(val.referralToUpdatedBy),
    };
  }

  async insert(val: ReferralTo): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(referralTo).values(this.toData(val));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} insert`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: ReferralTo): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(referralTo).set(this.toData(val))
        .where(
          and(
            eq(referralTo.base, this.base),
            eq(referralTo.id, val.id),
          ));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} update`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: ReferralTo): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(referralTo)
        .where(
          and(
            eq(referralTo.base, this.base),
            eq(referralTo.id, val.id),
          ));
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} delete`, e);
    }finally{
      this.database.close();
    }
  }

  private async select(cond: object): Promise<ReferralToDBResult[]> {
    const db = await this.database.open();
    return await db.query.referralTo.findMany({
      columns: {
        id: true,
        date: true,
        facilityDr: true,
        facilityDept: true,
        memo: true,
        updatedAt: true,
      },
      extras: {
        updatedAtString: (record, { sql }) => sql<string>`to_char(${record.updatedAt}, 'YYYY-MM-DD"T"HH24:MI:SS')`,
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
        referralToPersonInCharge: {
          columns: {
            id: true,
            name: true,
            departmentId: true,
          }
        },
        referralToUpdatedBy: {
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

  async read(id: string): Promise<ReferralTo|undefined> {
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

  async list(cond: Condition): Promise<ReferralTo[]> {
    const res = await this.select(this.buildCondition(cond));
    const list: ReferralTo[] = [];
    for await (const r of res){
      list.push(this.fromData(r));
    }
    return list;
  }
}