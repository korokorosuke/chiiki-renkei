import type { WebReservation } from "../../domain/webReservation.ts"
import type { IWebReservationRepository } from "../../domain/webReservationService.ts"
import { Db } from "./db.ts"
import { webReservation } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"
import { getNextMonth } from "../../lib/datetime.ts"

type WebReservationData = typeof webReservation.$inferInsert;

export class WebReservationRepository implements IWebReservationRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: WebReservation): WebReservationData {
    return {
      base: this.base,
      departmentId: val.dept,
      drId: val.dr,
      date: val.date,
      time: val.time,
      max: val.max,
      cnt: val.cnt,
    };
  }
  toDataWithoutKey(val: WebReservation): Partial<WebReservationData> {
    return {
      max: val.max,
      cnt: val.cnt,
    };
  }
  fromData(val: WebReservationData): WebReservation {
    return {
      dept: val.departmentId,
      dr: val.drId,
      date: val.date,
      time: val.time,
      max: val.max,
      cnt: val.cnt,
    };
  }

  async countUp(dept: string, date: string, dr: string, time: string, force: boolean|undefined): Promise<boolean>{
    const data = await this.read(dept, dr, date, time);
    if(data && (data.max - data.cnt > 0 || force)){
      try{
        const db = await this.database.open();
        await db.update(webReservation)
          .set({ cnt: data.cnt + 1 })
          .where(
            and(
              eq(webReservation.base, this.base),
              eq(webReservation.departmentId, dept),
              eq(webReservation.drId, dr),
              eq(webReservation.date, date),
              eq(webReservation.time, time),
            ));
        return true;
      }catch(e){
        console.log(e);
        return false;
      }finally{
        this.database.close();
      }
    }else{
      return false;
    }
  }

  async countDown(dept: string, date: string, dr: string, time: string): Promise<boolean>{
    const data = await this.read(dept, dr, date, time);
    if(data && data.cnt > 0){
      try{
        const db = await this.database.open();
        await db.update(webReservation)
          .set({ cnt: data.cnt - 1 })
          .where(
            and(
              eq(webReservation.base, this.base),
              eq(webReservation.departmentId, dept),
              eq(webReservation.drId, dr),
              eq(webReservation.date, date),
              eq(webReservation.time, time),
            ));
        return true;
      }catch(e){
        console.log(e);
        return false;
      }finally{
        this.database.close();
      }
    }else{
      return false;
    }
  }

  async insert(val: WebReservation): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(webReservation)
        .values(this.toData(val));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: WebReservation): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(webReservation).set(this.toDataWithoutKey(val))
        .where(
          and(
            eq(webReservation.base, this.base),
            eq(webReservation.departmentId, val.dept),
            eq(webReservation.drId, val.dr),
            eq(webReservation.date, val.date),
            eq(webReservation.time, val.time),
          ));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: WebReservation): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(webReservation)
        .where(
          and(
            eq(webReservation.base, this.base),
            eq(webReservation.departmentId, val.dept),
            eq(webReservation.drId, val.dr),
            eq(webReservation.date, val.date),
            eq(webReservation.time, val.time),
          ));
    }catch(e){
      console.log(e);
    }finally{
      this.database.close();
    }
  }

  async read(dept: string, dr: string, date: string, time: string): Promise<WebReservation|undefined> {
    const db = await this.database.open();
    const res = await db.query.webReservation.findFirst({
      where: {
        base: this.base,
        departmentId: dept,
        drId: dr,
        date: date,
        time: time,
      },
    });
    if(res){
      return this.fromData(res);
    }
    return undefined;
  }

  async list(dept: string, dr: string, date: string): Promise<WebReservation[]> {
    const db = await this.database.open();
    const res = await db.query.webReservation.findMany({
      where: {
        base: this.base,
        departmentId: dept,
        drId: dr,
        date: date,
      },
    });
    return res.map(this.fromData);
  }

  async listByDate(dept: string, yyyymm: string): Promise<WebReservation[]> {
    const db = await this.database.open();
    const res = await db.query.webReservation.findMany({
      where: {
        base: this.base,
        departmentId: dept,
        date: {gte: yyyymm + "-01", lt: getNextMonth(yyyymm + "-01")},
      },
    });
    return res.map(this.fromData);
  }
}