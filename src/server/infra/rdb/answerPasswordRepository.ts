import type { AnswerPassword } from "../../domain/answer.ts"
import type { IAnswerPasswordRepository } from "../../domain/answerService.ts"
import { Db } from "./db.ts"
import { answerPassword } from "../../db/schema.ts"
import { eq } from "drizzle-orm"

export class AnswerPasswordRepository implements IAnswerPasswordRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  async insert(val: AnswerPassword): Promise<boolean> {
    const db = await this.database.open();
    const res = (await db.insert(answerPassword).values(val)).rowsAffected;
    return res >= 1;
  }

  async update(val: AnswerPassword): Promise<boolean> {
    const db = await this.database.open();
    const res = (await db.update(answerPassword).set(val)
      .where(eq(answerPassword.appointmentId, val.appointmentId))).rowsAffected;
    return res >= 1;
  }

  async delete(val: AnswerPassword): Promise<void> {
    const db = await this.database.open();
    (await db.delete(answerPassword)
      .where(eq(answerPassword.appointmentId, val.appointmentId))).rowsAffected;
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
      const db = await this.database.open();
      const res = (await db.update(answerPassword).set({ failCount: ap.failCount + 1})
        .where(eq(answerPassword.appointmentId, appId))).rowsAffected;
      if(res > 0){
        return true;
      }
    }
    return false;
  }
}