import type { AnswerPassword } from "../../domain/answer.ts"
import type { IAnswerPasswordRepository } from "../../domain/answerService.ts"
import { Db } from "./db.ts"
import { answerPassword } from "../../db/schema.ts"
import { eq } from "drizzle-orm"
import { fatal } from "../../lib/log.ts"

export class AnswerPasswordRepository implements IAnswerPasswordRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  async insert(val: AnswerPassword): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(answerPassword).values(val);
      return true;
    }catch(e){
      await fatal(`${this.constructor.name} insert`, e, this.base);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: AnswerPassword): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(answerPassword).set(val)
        .where(eq(answerPassword.appointmentId, val.appointmentId));
      return true;
    }catch(e){
      await fatal(`${this.constructor.name} update`, e, this.base);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: AnswerPassword): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.delete(answerPassword)
        .where(eq(answerPassword.appointmentId, val.appointmentId));
      return true;
    }catch(e){
      await fatal(`${this.constructor.name} delete`, e, this.base);
      return false;
    }finally{
      this.database.close();
    }
  }

  async read(appId: string): Promise<AnswerPassword|undefined> {
    const db = await this.database.open();
    const res = await db.select().from(answerPassword)
      .where(eq(answerPassword.appointmentId, appId));
    if(res.length > 0){
      return res[0];
    }
    return undefined;
  }

  async countUp(appId: string): Promise<boolean> {
    const ap = await this.read(appId);
    if(ap){
      try{
        const db = await this.database.open();
        await db.update(answerPassword).set({ failCount: ap.failCount + 1})
          .where(eq(answerPassword.appointmentId, appId));
        return true;
      }catch(e){
        await fatal(`${this.constructor.name} countUp`, e, this.base);
        return false;
      }finally{
        this.database.close();
      }
    }
    return false;
  }
}