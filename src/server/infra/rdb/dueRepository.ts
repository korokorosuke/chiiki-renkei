import type { Due } from "../../domain/due.ts"
import type { IDueRepository } from "../../domain/dueService.ts"
import { Db } from "./db.ts"
import { due } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"

type DueData = typeof due.$inferInsert;

export class DueRepository implements IDueRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Due): DueData {
    return {
      base: this.base,
      id: val.id,
      name: val.name,
      days: val.days
    };
  }

  async insert(val: Due): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(due).values(this.toData(val));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Due): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(due).set(this.toData(val))
        .where(
          and(
            eq(due.base, this.base),
            eq(due.id, val.id),
          ));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Due): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(due)
        .where(
          and(
            eq(due.base, this.base),
            eq(due.id, val.id),
          ));
    }catch(e){
      console.log(e);
    }finally{
      this.database.close();
    }
  }

  async read(id: number): Promise<Due|undefined> {
    const db = await this.database.open();
    const res = await db.query.due.findFirst({
      columns: {
        id: true,
        name: true,
        days: true,
      },
      where: {
        base: this.base,
        id: id,
      },
    })
    return res;
  }

  async all(): Promise<Due[]> {
    const db = await this.database.open();
    const res = await db.select().from(due)
      .where(eq(due.base, this.base));
    return res;
  }
}