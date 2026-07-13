import type { Dr } from "../../domain/dr.ts"
import type { IDrRepository } from "../../domain/drService.ts"
import { Db } from "./db.ts"
import { dr } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"

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
    const db = await this.database.open();
    const res = (await db.insert(dr).values(this.toData(val))).rowsAffected;
    return res >= 1;
  }

  async update(val: Dr): Promise<boolean> {
    const db = await this.database.open();
    const res = (await db.update(dr).set(this.toData(val))
      .where(
        and(
          eq(dr.base, this.base),
          eq(dr.id, val.id),
        ))).rowsAffected;
    return res >= 1;
  }

  async delete(val: Dr): Promise<void> {
    const db = await this.database.open();
    (await db.delete(dr)
      .where(
        and(
          eq(dr.base, this.base),
          eq(dr.id, val.id),
        ))).rowsAffected;
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