import type { AuthUser, Condition } from "../../domain/user.ts"
import type { IUserRepository } from "../../domain/userService.ts"
import { Db } from "./db.ts"
import { user } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"

type UserData = typeof user.$inferInsert;

export class UserRepository implements IUserRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: AuthUser): UserData {
    return {
      base: this.base,
      id: val.id,
      name: val.name,
      departmentId: val.department,
      authFacility: val.authFacility,
      authReferral: val.authReferral,
      authActivity: val.authActivity,
      authStatistics: val.authStatistics,
      authMaster: val.authMaster,
      authWeb: val.authWeb,
      password: val.password ??  "",
      facilityId: val.facilityId ?? "",
      locked: val.locked ? true : false,
      failCount: val.failCount ?? 0,
    };
  }
  fromData(val: UserData): AuthUser {
    return {
      base: this.base,
      id: val.id,
      name: val.name,
      department: val.departmentId,
      authFacility: val.authFacility,
      authReferral: val.authReferral,
      authActivity: val.authActivity,
      authStatistics: val.authStatistics,
      authMaster: val.authMaster,
      authWeb: val.authWeb,
      password: val.password,
      facilityId: val.facilityId,
      locked: val.locked,
      failCount: val.failCount
    };
  }

  async insert(val: AuthUser): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(user).values(this.toData(val));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: AuthUser): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(user).set(this.toData(val))
        .where(
          and(
            eq(user.base, this.base),
            eq(user.id, val.id),
          ));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: AuthUser): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(user)
        .where(
          and(
            eq(user.base, this.base),
            eq(user.id, val.id),
          ));
    }catch(e){
      console.log(e);
    }finally{
      this.database.close();
    }
  }

  async read(id: string): Promise<AuthUser|undefined> {
    const db = await this.database.open();
    const res = await db.query.user.findFirst({
      where: {
        base: this.base,
        id: id
      }
    });
    if(res){
      return this.fromData(res);
    }
    return undefined;
  }

  async list(cond: Condition): Promise<AuthUser[]> {
    const db = await this.database.open();
    const res = await db.query.user.findMany({
      where: {
        base: this.base,
        name: {
          like: `%${cond.name}%`,
        },
      }
    });
    if(res.length > 0){
      return res.map((val) => this.fromData(val));
    }
    return [];
  }
}