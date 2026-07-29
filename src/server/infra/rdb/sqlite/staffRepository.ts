import type { Staff, Condition } from "../../../domain/staff.ts"
import type { IStaffRepository } from "../../../domain/staffService.ts"
import { type UserDBResult, toUser } from "../types.ts"
import { Db } from "./dbSQLite.ts"
import { staff } from "../../../db/schemaSQLite.ts"
import { and, eq } from "drizzle-orm"

type StaffData = typeof staff.$inferInsert;

export type StaffDBResult = {
  id: string,
  name: string,
  kana: string,
  department: string,
  dr: number,
  post: string,
  facilityId: string,
  order: number,
  hidden: number,
  user: UserDBResult | null,
  updatedAt: string
}

export class StaffRepository implements IStaffRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Staff): StaffData {
    return {
      ...val,
      base: this.base,
      dr: val.dr ? 1 : 0,
      hidden: val.hidden ? 1: 0,
      order: val.sort,
      updatedBy: val.updatedBy.id,
    }
  }
  toDataWithoutKey(val: Staff): Partial<StaffData> {
    // deno-lint-ignore no-unused-vars
    const {base, id, ...etc} = this.toData(val);
    return etc;
  }
  fromData(val: StaffDBResult): Staff {
    return {
      ...val,
      dr: val.dr ? true : false,
      hidden: val.hidden ? true : false,
      sort: val.order,
      updatedBy: toUser(val.user),
    };
  }

  async insert(val: Staff): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(staff).values(this.toData(val));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Staff): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(staff).set(this.toDataWithoutKey(val))
        .where(
          and(
            eq(staff.base, this.base),
            eq(staff.id, val.id),
          ));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Staff): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(staff)
        .where(
          and(
            eq(staff.base, this.base),
            eq(staff.id, val.id),
          ));
    }catch(e){
      console.log(e);
    }finally{
      this.database.close();
    }
  }

  async select(cond: object): Promise<StaffDBResult[]> {
    const db = await this.database.open();
    return await db.query.staff.findMany({
      columns: {
        base: false,
        updatedBy: false,
      },
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            departmentId: true,
          }
        },
      },
      where: cond,
    });
  }

  async read(id: string): Promise<Staff|undefined> {
    const res = await this.select({base: this.base, id: id});
    if(res.length > 0){
      return this.fromData(res[0]);
    }
    return undefined;
  }

  private buildCondition(cond: Condition): object {
    let conditions: object = {base: this.base};
    if(cond.facilityid){
      conditions = {...conditions, facilityId: cond.facilityid};
    }
    if(cond.dr){
      conditions = {...conditions, dr: cond.dr};
    }
    if(!cond.hidden){
      conditions = {...conditions, hidden: 0};
    }
    return conditions;
  }

  async list(cond: Condition): Promise<Staff[]> {
    const res = await this.select(this.buildCondition(cond));
    const list: Staff[] = [];
    for await (const r of res){
      list.push(this.fromData(r));
    }
    return list;
  }
}