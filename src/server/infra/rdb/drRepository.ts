import type { Dr } from "../../domain/dr.ts"
import type { IDrRepository } from "../../domain/drService.ts"
import { Db } from "./db.ts"
import { dr } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"
import { LogService } from "../../domain/logService.ts"
import { LogRepository } from "./logRepository.ts"

type DrData = typeof dr.$inferInsert;

export class DrRepository implements IDrRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Dr): DrData {
    return {
      base: this.base,
      id: val.id,
      name: val.name,
      department: val.department
    };
  }

  async insert(val: Dr): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(dr).values(this.toData(val));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} insert`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Dr): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(dr).set(this.toData(val))
        .where(
          and(
            eq(dr.base, this.base),
            eq(dr.id, val.id),
          ));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} update`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Dr): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(dr)
        .where(
          and(
            eq(dr.base, this.base),
            eq(dr.id, val.id),
          ));
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} delete`, e);
    }finally{
      this.database.close();
    }
  }

  async read(id: string): Promise<Dr|undefined> {
    const db = await this.database.open();
    const res = await db.query.dr.findFirst({
      columns: {
        id: true,
        name: true,
        department: true,
      },
      where: {
        base: this.base,
        id: id,
      },
    });
    return res;
  }

  async list(dept: string): Promise<Dr[]> {
    const db = await this.database.open();
    const res = await db.query.dr.findMany({
      columns: {
        id: true,
        name: true,
        department: true,
      },
      where: {
        base: this.base,
        department: dept
      }
    });
    return res;
  }

  async all(): Promise<Dr[]> {
    const db = await this.database.open();
    const res = await db.query.dr.findMany({
      columns: {
        id: true,
        name: true,
        department: true,
      },
      where: {
        base: this.base
      }
    });
    return res;
  }
}