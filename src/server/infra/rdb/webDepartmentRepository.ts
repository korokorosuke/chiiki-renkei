import type { WebDepartment } from "../../domain/webDepartment.ts"
import type { IWebDepartmentRepository } from "../../domain/webDepartmentService.ts"
import { Db } from "./db.ts"
import { webDepartment } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"

type WebDepartmentData = typeof webDepartment.$inferInsert;

export class WebDepartmentRepository implements IWebDepartmentRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: WebDepartment): WebDepartmentData {
    return {
      base: this.base,
      id: val.id,
      name: val.name,
      description: val.description,
    };
  }

  async insert(val: WebDepartment): Promise<boolean> {
    const db = await this.database.open();
    const res = (await db.insert(webDepartment).values(this.toData(val))).rowsAffected;
    return res >= 1;
  }

  async update(val: WebDepartment): Promise<boolean> {
    const db = await this.database.open();
    const res = (await db.update(webDepartment).set(this.toData(val))
      .where(
        and(
          eq(webDepartment.base, this.base),
          eq(webDepartment.id, val.id),
        ))).rowsAffected;
    return res >= 1;
  }

  async delete(val: WebDepartment): Promise<void> {
    const db = await this.database.open();
    (await db.delete(webDepartment)
      .where(
        and(
          eq(webDepartment.base, this.base),
          eq(webDepartment.id, val.id),
        ))).rowsAffected;
  }

  async read(id: string): Promise<WebDepartment|undefined> {
    const db = await this.database.open();
    const res = await db.query.webDepartment.findFirst({
      columns: {
        base: false,
      },
      where: {
        base: this.base,
        id: id
      }
    });
    if(res){
      return res;
    }
    return undefined;
  }

  async all(): Promise<WebDepartment[]> {
    const db = await this.database.open();
    const res = await db.query.webDepartment.findMany({
      columns: {
        base: false,
      },
      where: {
        base: this.base
      }
    });
    if(res.length > 0){
      return res;
    }
    return [];
  }
}