import type { Staff, Condition } from "../../domain/staff.ts"
import type { IStaffRepository } from "../../domain/staffService.ts"
import { type UserDBResult, toUser } from "./types.ts"
import { Db } from "./db.ts"
import { staff } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"
import { LogService } from "../../domain/logService.ts"
import { LogRepository } from "./logRepository.ts"

type StaffData = typeof staff.$inferInsert;

export type StaffDBResult = {
  id: string,
  name: string,
  kana: string,
  department: string,
  dr: boolean,
  post: string,
  facilityId: string,
  order: number,
  hidden: boolean,
  user: UserDBResult | null,
  updatedAt: string,
  updatedAtString?: string
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
      dr: val.dr,
      hidden: val.hidden,
      order: val.sort,
      updatedBy: val.updatedBy.id,
      updatedAt: val.updatedAt
    }
  }
  fromData(val: StaffDBResult): Staff {
    return {
      ...val,
      dr: val.dr ? true : false,
      hidden: val.hidden ? true : false,
      sort: val.order,
      updatedBy: toUser(val.user),
      updatedAt: val.updatedAtString!
    };
  }

  async insert(val: Staff): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(staff).values(this.toData(val));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} insert`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Staff): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(staff).set(this.toData(val))
        .where(
          and(
            eq(staff.base, this.base),
            eq(staff.id, val.id),
          ));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} update`, e);
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
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} delete`, e);
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
      extras: {
        updatedAtString: (record, { sql }) => sql<string>`to_char(${record.updatedAt}, 'YYYY-MM-DD"T"HH24:MI:SS')`,
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
      orderBy: {
        order: "asc",
      }
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