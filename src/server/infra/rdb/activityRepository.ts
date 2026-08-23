import type { Activity, Condition } from "../../domain/activity.ts"
import type { IActivityRepository } from "../../domain/activityService.ts"
import { Db } from "./db.ts"
import { activity, activityPurpose } from "../../db/schema.ts"
import { UserDBResult, FacilityDBResult, toFacility, toUser } from "./types.ts"
import { and, eq } from "drizzle-orm"
import { addDay } from "../../lib/datetime.ts"
import { fatal } from "../../lib/log.ts"

type ActivityData = typeof activity.$inferInsert;

type ActivityDBResult = {
  id: string,
  date: string,
  toDate: string | null,
  dateString?: string,
  toDateString?: string,
  participants: string,
  facilityParticipants: string,
  details: string,
  activityPurposes: {
    purpose: string,
  }[],
  facility: FacilityDBResult | null,
  user: UserDBResult | null,
  updatedAt: string,
  updatedAtString?: string
}

export class ActivityRepository implements IActivityRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base
  }

  toData(val: Activity): ActivityData {
    return {
      base: this.base,
      id: val.id,
      date: val.date,
      toDate: val.toDate === "" ? null : val.toDate,
      participants: val.participants,
      facilityParticipants: val.facilityParticipants,
      details: val.details,
      facilityId: val.facility.id,
      updatedBy: val.updatedBy.id,
      updatedAt: val.updatedAt,
    };
  }
  fromData(val: ActivityDBResult): Activity {
    return {
      ...val,
      date: val.dateString ?? "",
      toDate: val.toDateString ?? "",
      facility: toFacility(val.facility),
      purpose: val.activityPurposes.map(p => p.purpose),
      updatedBy: toUser(val.user),
      updatedAt: val.updatedAtString!,
    };
  }

  async insert(val: Activity): Promise<boolean> {
    const db = await this.database.open();
    const res = await db.transaction(async (tx) => {
      try{
        await tx.insert(activity).values(this.toData(val));
        if(val.purpose.length > 0){
          await tx.insert(activityPurpose)
            .values(val.purpose.map(p => ({activityId: val.id, purpose: p})));
        }
        return true;
      }catch(e){
        tx.rollback()
        await fatal(`${this.constructor.name} insert`, e, this.base);
        return false;
      }
    });
    this.database.close();
    return res;
  }

  async update(val: Activity): Promise<boolean> {
    const db = await this.database.open();
    const res = await db.transaction(async (tx) => {
      try{
        await tx.update(activity).set(this.toData(val))
          .where(
            and(
              eq(activity.base, this.base),
              eq(activity.id, val.id),
            ));
        await tx.delete(activityPurpose).where(eq(activityPurpose.activityId, val.id));
        if(val.purpose.length > 0){
          await tx.insert(activityPurpose)
            .values(val.purpose.map(p => ({activityId: val.id, purpose: p})));
        }
        return true;
      }catch(e){
        tx.rollback()
        await fatal(`${this.constructor.name} update`, e, this.base);
        return false;
      }
    });
    this.database.close();
    return res;
  }

  async delete(val: Activity): Promise<boolean> {
    const db = await this.database.open();
    const res = await db.transaction(async (tx) => {
      try{
        await tx.delete(activityPurpose).where(eq(activityPurpose.activityId, val.id));
        await tx.delete(activity)
          .where(
            and(
              eq(activity.base, this.base),
              eq(activity.id, val.id),
            ));
        return true;
      }catch(e){
        tx.rollback()
        await fatal(`${this.constructor.name} delete`, e, this.base);
        return false;
      }
    });
    this.database.close();
    return res;
  }

  private async select(cond: object): Promise<ActivityDBResult[]> {
    const db = await this.database.open();
    return await db.query.activity.findMany({
      columns: {
        id: true,
        date: true,
        toDate: true,
        participants: true,
        facilityParticipants: true,
        details: true,
        updatedAt: true,
      },
      extras: {
        dateString: (record, { sql }) => sql<string>`to_char(${record.date}, 'YYYY-MM-DD"T"HH24:MI')`,
        toDateString: (record, { sql }) => sql<string>`to_char(${record.toDate}, 'YYYY-MM-DD"T"HH24:MI')`,
        updatedAtString: (record, { sql }) => sql<string>`to_char(${record.updatedAt}, 'YYYY-MM-DD"T"HH24:MI:SS')`,
      },
      with: {
        activityPurposes: {
          columns: {
            purpose: true,
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
        user: {
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

  async read(id: string): Promise<Activity|undefined> {
    const res = await this.select({id: id});
    if(res.length > 0){
      if(res.length > 0){
        return this.fromData(res[0]);
      }
    }
    return undefined;
  }

  private buildCondition(cond: Condition): object {
    let conditions: object = {base: this.base};
    let fromDate = "1900-01-01", toDate = "2999-12-31";
    if(cond.fromDate){
      fromDate = cond.fromDate;
    }
    if(cond.toDate){
      toDate = addDay(cond.toDate);
    }
    conditions = {...conditions, AND: [
      {
        date:{gte: fromDate}
      },
      {
        date:{lt: toDate}
      }
    ]};
    if(cond.facilityId){
      conditions = {...conditions, facilityId: cond.facilityId};
    }
    return conditions;
  }

  async list(cond: Condition): Promise<Activity[]> {
    const res = await this.select(this.buildCondition(cond));
    const list: Activity[] = [];
    for await (const r of res){
      list.push(this.fromData(r));
    }
    return list;
  }
}