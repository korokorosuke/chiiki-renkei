import type { Department } from "../../domain/department.ts"
import type { IDepartmentRepository } from "../../domain/departmentService.ts"
import { Db } from "./db.ts"
import { department } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"

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
      exam: val.exam ? 1 : 0
    };
  }
  fromData(val: DepartmentData): Department {
    return {
      id: val.id,
      name: val.name,
      exam: val.exam ? true : false
    };
  }

  async insert(val: Department): Promise<boolean> {
    const db = await this.database.open();
    const res = (await db.insert(department).values(this.toData(val))).rowsAffected;
    return res >= 1;
  }

  async update(val: Department): Promise<boolean> {
    const db = await this.database.open();
    const res = (await db.update(department).set(this.toData(val))
      .where(
        and(
          eq(department.base, this.base),
          eq(department.id, val.id),
        ))).rowsAffected;
    return res >= 1;
  }

  async delete(val: Department): Promise<void> {
    const db = await this.database.open();
    (await db.delete(department)
      .where(
        and(
          eq(department.base, this.base),
          eq(department.id, val.id),
        ))).rowsAffected;
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
        exam: 1
      }
    });
    if(res.length > 0){
      return res.map(val => this.fromData(val));
    }
    return [];
  }
}