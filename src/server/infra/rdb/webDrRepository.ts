import type { WebDr } from "../../domain/webDr.ts"
import type { IWebDrRepository } from "../../domain/webDrService.ts"
import { Db } from "./db.ts"
import { webDr } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"

type WebDrData = typeof webDr.$inferInsert;

export class WebDrRepository implements IWebDrRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: WebDr): WebDrData {
    return {
      base: this.base,
      id: val.id,
      name: val.name,
      displayName: val.displayName,
      department: val.department,
    };
  }

  async insert(val: WebDr): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(webDr).values(this.toData(val));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: WebDr): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(webDr).set(this.toData(val))
        .where(
          and(
            eq(webDr.base, this.base),
            eq(webDr.id, val.id),
          ));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: WebDr): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(webDr)
        .where(
          and(
            eq(webDr.base, this.base),
            eq(webDr.id, val.id),
          ));
    }catch(e){
      console.log(e);
    }finally{
      this.database.close();
    }
  }

  async read(id: string): Promise<WebDr|undefined> {
    const db = await this.database.open();
    const res = await db.query.webDr.findFirst({
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

  async list(dept: string): Promise<WebDr[]> {
    const db = await this.database.open();
    const res = await db.query.webDr.findMany({
      columns: {
        base: false,
      },
      where: {
        base: this.base,
        department: dept,
      }
    });
    if(res.length > 0){
      return res;
    }
    return [];
  }

  async all(): Promise<WebDr[]> {
    const db = await this.database.open();
    const res = await db.query.webDr.findMany({
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