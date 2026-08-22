import type { Department } from "../../domain/department.ts"
import type { IDepartmentRepository } from "../../domain/departmentService.ts"
import { Db } from "./db.ts"
import { department } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"
import { LogService } from "../../domain/logService.ts"
import { LogRepository } from "./logRepository.ts"

type DepartmentData = typeof department.$inferInsert;

export class DepartmentRepository implements IDepartmentRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Department): DepartmentData {
    return {
      base: this.base,
      id: val.id,
      name: val.name,
      exam: val.exam
    };
  }
  fromData(val: DepartmentData): Department {
    return {
      id: val.id,
      name: val.name,
      exam: val.exam
    };
  }

  async insert(val: Department): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(department).values(this.toData(val));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} insert`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Department): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(department).set(this.toData(val))
        .where(
          and(
            eq(department.base, this.base),
            eq(department.id, val.id),
          ));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} update`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Department): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(department)
        .where(
          and(
            eq(department.base, this.base),
            eq(department.id, val.id),
          ));
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} delete`, e);
    }finally{
      this.database.close();
    }
  }

  async read(id: string): Promise<Department|undefined> {
    const db = await this.database.open();
    const res = await db.query.department.findFirst({
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

  async all(): Promise<Department[]> {
    const db = await this.database.open();
    const res = await db.query.department.findMany({
      where: {
        base: this.base
      }
    });
    if(res.length > 0){
      return res.map(val => this.fromData(val));
    }
    return [];
  }

  async exam(): Promise<Department[]> {
    const db = await this.database.open();
    const res = await db.query.department.findMany({
      where: {
        base: this.base,
        exam: true
      }
    });
    if(res.length > 0){
      return res.map(val => this.fromData(val));
    }
    return [];
  }
}