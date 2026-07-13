import type { WebMaster } from "../../domain/webMaster.ts"
import type { IWebMasterRepository } from "../../domain/webMasterService.ts"
import { Db } from "./db.ts"
import { webMaster, webReserv } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"

type WebMasterData = typeof webMaster.$inferInsert;
type WebReservData = typeof webReserv.$inferInsert;

type WebMasterDBResult = {
  departmentId: string,
  drId: string,
  week: number,
  webReservs: {
    time: string,
    max: number,
  }[],
}

export class WebMasterRepository implements IWebMasterRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: WebMaster): WebMasterData {
    return {
      base: this.base,
      departmentId: val.dept,
      drId: val.dr,
      week: val.week,
    };
  }
  toReservData(val: WebMaster): WebReservData[] {
    return val.reservs.map(reserv => ({
      base: this.base,
      departmentId: val.dept,
      drId: val.dr,
      week: val.week,
      time: reserv.time,
      max: reserv.max,
    }));
  }
  fromData(val: WebMasterDBResult): WebMaster {
    return {
      dept: val.departmentId,
      dr: val.drId,
      week: val.week,
      reservs: val.webReservs.map(reserv => ({
        time: reserv.time,
        max: reserv.max,
      })),
    };
  }

  async insert(val: WebMaster): Promise<boolean> {
    const db = await this.database.open();
    const res: number = await db.transaction(async (tx) => {
      const res1 = (await tx.insert(webMaster).values(this.toData(val))).rowsAffected;
      if(res1 >= 1){
        if(val.reservs.length > 0){
          const res2 = (await tx.insert(webReserv)
            .values(this.toReservData(val))).rowsAffected;
          if(res2 === 0){
            tx.rollback();
            return 0;
          }
        }
        return res1;
      }
      tx.rollback()
      return 0;
    });
    return res >= 1;
  }

  async update(val: WebMaster): Promise<boolean> {
    const db = await this.database.open();
    const res: number = await db.transaction(async (tx) => {
      await tx.delete(webReserv).where(
        and(
          eq(webReserv.base, this.base),
          eq(webReserv.departmentId, val.dept),
          eq(webReserv.drId, val.dr),
          eq(webReserv.week, val.week),
        ));
      if(val.reservs.length > 0){
        const res2 = (await tx.insert(webReserv)
          .values(this.toReservData(val))).rowsAffected;
        if(res2 === 0){
          tx.rollback();
          return 0;
        }
      }
      return 1;
    });
    return res >= 1;
  }

  async delete(val: WebMaster): Promise<void> {
    const db = await this.database.open();
    await db.transaction(async (tx) => {
      await tx.delete(webReserv).where(
        and(
          eq(webReserv.base, this.base),
          eq(webReserv.departmentId, val.dept),
          eq(webReserv.drId, val.dr),
          eq(webReserv.week, val.week),
        ));
      (await tx.delete(webMaster)
        .where(
          and(
            eq(webMaster.base, this.base),
            eq(webMaster.departmentId, val.dept),
            eq(webMaster.drId, val.dr),
            eq(webMaster.week, val.week),
          ))).rowsAffected;
    });
  }

  async read(dept: string, dr: string, week: number): Promise<WebMaster|undefined> {
    const db = await this.database.open();
    const res = await db.query.webMaster.findFirst({
      columns: {
        base: false,
      },
      with: {
        webReservs: {
          columns: {
            time: true,
            max: true,
          },
        },
      },
      where: {
        base: this.base,
        departmentId: dept,
        drId: dr,
        week: week,
      },
    });
    if(res){
      return this.fromData(res);
    }
    return undefined;
  }
}