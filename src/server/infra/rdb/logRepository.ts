import type { Log, LogLevel } from "../../domain/log.ts"
import type { ILogRepository } from "../../domain/logService.ts"
import type { ILogListRepository } from "../../domain/logListService.ts"
import { Db } from "./db.ts"
import { log } from "../../db/schema.ts"
import { sql, and, eq, gte, lte, desc } from "drizzle-orm"

type LogData = typeof log.$inferInsert;

export class LogRepository implements ILogRepository, ILogListRepository {
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

  async list(level: string, fromDate: string, toDate: string, userId: string, patientId: string): Promise<Log[]> {
    const db = await this.database.open();
    const logs = await db.select({
      level: log.level,
      datetime: sql<string>`to_char(${log.datetime}, 'YYYY-MM-DD"T"HH24:MI:SS')`,
      title: log.title,
      details: log.details,
      userId: log.userId,
      patientId: log.patientId,
    }).from(log).where(
      and(
        level ? eq(log.level, level) : undefined,
        fromDate ? gte(log.datetime, fromDate) : undefined,
        toDate ? lte(log.datetime, toDate) : undefined,
        userId ? eq(log.userId, userId) : undefined,
        patientId ? eq(log.patientId, patientId) : undefined,
      )
    ).orderBy(desc(log.datetime));
    return logs.map((log) => ({ ...log, level: log.level as LogLevel,
      userId: log.userId ? log.userId : undefined,
      patientId: log.patientId ? log.patientId : undefined }));
  }
}