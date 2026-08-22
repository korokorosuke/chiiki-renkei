import type { Log } from "../../domain/log.ts"
import type { ILogRepository } from "../../domain/logService.ts"
import { Db } from "./db.ts"
import { log } from "../../db/schema.ts"

type LogData = typeof log.$inferInsert;

export class LogRepository implements ILogRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Log): LogData {
    return {
      ...val,
      base: this.base,
    };
  }

  async write(val: Log): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(log).values(this.toData(val));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }
}