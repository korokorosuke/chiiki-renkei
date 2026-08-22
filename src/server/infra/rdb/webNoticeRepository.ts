import type { WebNotice } from "../../domain/webNotice.ts"
import type { IWebNoticeRepository } from "../../domain/webNoticeService.ts"
import { Db } from "./db.ts"
import { webNotice } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"
import { LogService } from "../../domain/logService.ts"
import { LogRepository } from "./logRepository.ts"

type WebNoticeData = typeof webNotice.$inferInsert;

export class WebNoticeRepository implements IWebNoticeRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: WebNotice): WebNoticeData {
    return {
      ...val,
      base: this.base,
    };
  }

  async insert(val: WebNotice): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(webNotice).values(this.toData(val));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} insert`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: WebNotice): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(webNotice).set(this.toData(val))
        .where(
          and(
            eq(webNotice.base, this.base),
            eq(webNotice.id, val.id),
          ))
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} update`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: WebNotice): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(webNotice)
        .where(
          and(
            eq(webNotice.base, this.base),
            eq(webNotice.id, val.id),
          ));
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} delete`, e);
    }finally{
      this.database.close();
    }
  }

  async read(id: string): Promise<WebNotice|undefined> {
    const db = await this.database.open();
    const res = await db.query.webNotice.findFirst({
      columns: {
        base: false,
      },
      where: {
        base: this.base,
        id: id,
      },
    });
    return res;
  }

  async list(date?: string): Promise<WebNotice[]> {
    const db = await this.database.open();
    const res = await db.query.webNotice.findMany({
      columns: {
        base: false,
      },
      where: (date ? {
        base: this.base,
        fromDate: { lte: date },
        toDate: { gte: date },
      } : {
        base: this.base,
      }),
    });
    return res;
  }
}