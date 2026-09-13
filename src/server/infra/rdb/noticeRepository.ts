import type { Notice, NoticePage } from "../../domain/notice.ts"
import type { INoticeRepository } from "../../domain/noticeService.ts"
import { Db } from "./db.ts"
import { notice } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"
import { fatal } from "../../lib/log.ts"

type NoticeData = typeof notice.$inferInsert;

export type NoticeDBResult = {
  id: string,
  page: string,
  message: string,
  fromDate: string,
  toDate: string,
  importance: boolean,
}

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

  fromData(val: NoticeDBResult): Notice {
    return {
      ...val,
      page: val.page as NoticePage,
    };
  }

  async insert(val: Notice): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(notice).values(this.toData(val));
      return true;
    }catch(e){
      await fatal(`${this.constructor.name} insert`, e, this.base);
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
      await fatal(`${this.constructor.name} update`, e, this.base);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Notice): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.delete(notice)
        .where(
          and(
            eq(notice.base, this.base),
            eq(notice.id, val.id),
          ));
      return true;
    }catch(e){
      await fatal(`${this.constructor.name} delete`, e, this.base);
      return false;
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
    if(res){
      return this.fromData(res);
    }
    return undefined;
  }

  async all(): Promise<Notice[]> {
    const db = await this.database.open();
    const res = await db.query.notice.findMany({
      columns: {
        base: false,
      },
      where: {
        base: this.base,
      },
      orderBy: {
        fromDate: "desc",
      }
    });
    if(res.length > 0){
      return res.map((n) => this.fromData(n));
    }
    return [];
  }

  async list(page: NoticePage, date: string): Promise<Notice[]> {
    const db = await this.database.open();
    const res = await db.query.notice.findMany({
      columns: {
        base: false,
      },
      where: {
        base: this.base,
        page: page,
        fromDate: { lte: date },
        toDate: { gte: date },
      },
      orderBy: {
        fromDate: "desc",
      }
    });
    if(res.length > 0){
      return res.map((n) => this.fromData(n));
    }
    return [];
  }
}