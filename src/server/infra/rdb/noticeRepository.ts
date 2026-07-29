import type { Notice } from "../../domain/notice.ts"
import type { INoticeRepository } from "../../domain/noticeService.ts"
import { Db } from "./db.ts"
import { notice } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"

type NoticeData = typeof notice.$inferInsert;

export class NoticeRepository implements INoticeRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Notice): NoticeData {
    return {
      ...val,
      base: this.base,
    };
  }

  async insert(val: Notice): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(notice).values(this.toData(val));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Notice): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(notice).set(this.toData(val))
        .where(
          and(
            eq(notice.base, this.base),
            eq(notice.id, val.id),
          ));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Notice): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(notice)
        .where(
          and(
            eq(notice.base, this.base),
            eq(notice.id, val.id),
          ));
    }catch(e){
      console.log(e);
    }finally{
      this.database.close();
    }
  }

  async read(id: string): Promise<Notice|undefined> {
    const db = await this.database.open();
    const res = await db.query.notice.findFirst({
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

  async list(date?: string): Promise<Notice[]> {
    const db = await this.database.open();
    const res = await db.query.notice.findMany({
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