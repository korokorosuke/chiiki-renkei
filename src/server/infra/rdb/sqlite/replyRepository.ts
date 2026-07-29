import type { Reply, Condition } from "../../../domain/reply.ts"
import type { IReplyRepository } from "../../../domain/replyService.ts"
import type { Referral } from "../../../domain/referral.ts"
import { initializeDept } from "../../../domain/department.ts"
import { initialize as initializeDr } from "../../../domain/dr.ts"
import { Db } from "./dbSQLite.ts"
import { reply } from "../../../db/schemaSQLite.ts"
import { type PatientDBResult, type FacilityDBResult, type UserDBResult, type DepartmentDBResult,
  toUser, toPatient, toFacility } from "../types.ts"
import { and, eq } from "drizzle-orm"
import { addDay } from "../../../lib/datetime.ts"

type ReplyData = typeof reply.$inferInsert;

type ReplyDBResult = {
  id: string,
  date: string,
  patient: PatientDBResult | null,
  facility: FacilityDBResult | null,
  department: DepartmentDBResult | null,
  dr: {
    id: string,
    name: string,
    department: string,
  } | null,
  reply: {
    id: string,
    date: string,
    department: DepartmentDBResult | null,
    dr: {
      id: string,
      name: string,
      department: string,
    } | null,
    classification: string,
    replyPersonInCharge: UserDBResult | null,
    memo: string,
    replyUpdatedBy: UserDBResult | null,
    updatedAt: string
  }[] | null
}

export class ReplyRepository implements IReplyRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Reply): ReplyData {
    return {
      base: this.base,
      id: val.id,
      refId: val.refId,
      date: val.date,
      departmentId: val.department.id,
      drId: val.dr.id,
      personInChargeId: val.personInCharge.id,
      classification: val.classification,
      memo: val.memo,
      updatedBy: val.updatedBy.id,
      updatedAt: val.updatedAt,
    };
  }
  toDataWithoutKey(val: Reply): Partial<ReplyData> {
    // deno-lint-ignore no-unused-vars
    const {base, id, ...etc} = this.toData(val);
    return etc;
  }
  fromData(val: ReplyDBResult): Referral {
    const replies = [];
    if(val.reply){
      for(const rep of val.reply){
        replies.push({
          id: rep.id,
          date: rep.date,
          classification: rep.classification,
          refId: val.id,
          department: rep.department ?? initializeDept(),
          dr: rep.dr ?? initializeDr(),
          personInCharge: toUser(rep.replyPersonInCharge),
          memo: rep.memo,
          updatedBy: toUser(rep.replyUpdatedBy),
          updatedAt: rep.updatedAt,
        });
      }
    }
    return {
      id: val.id,
      date: val.date,
      patient: toPatient(val.patient),
      facility: toFacility(val.facility),
      department: val.department ?? initializeDept(),
      dr: val.dr ?? initializeDr(),
      replies: replies
    };
  }

  async insert(val: Reply): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(reply).values(this.toData(val));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Reply): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(reply).set(this.toDataWithoutKey(val))
        .where(
          and(
            eq(reply.base, this.base),
            eq(reply.id, val.id),
          ));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Reply): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(reply)
        .where(
          and(
            eq(reply.base, this.base),
            eq(reply.id, val.id),
          ));
    }catch(e){
      console.log(e);
    }finally{
      this.database.close();
    }
  }

  private async select(cond: object, condApp: object): Promise<ReplyDBResult[]> {
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
        reply: {
          columns: {
            id: true,
            date: true,
            classification: true,
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
            replyPersonInCharge: {
              columns: {
                id: true,
                name: true,
                departmentId: true,
              }
            },
            replyUpdatedBy: {
              columns: {
                id: true,
                name: true,
                departmentId: true,
              }
            },
          },
          where: cond,
          orderBy: {
            date: "asc"
          },
        },
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
      },
      where: condApp,
      orderBy: {
        date: "desc"
      },
    });
  }

  async read(id: string): Promise<Referral|undefined> {
    const res = await this.select({base: this.base, id: id},
      {base: this.base, reply: {id: id}});
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

  async list(cond: Condition): Promise<Referral[]> {
    const res = await this.select({base: this.base}, this.buildCondition(cond));
    const list: Referral[] = [];
    for await (const r of res){
      list.push(this.fromData(r));
    }
    return list;
  }
}