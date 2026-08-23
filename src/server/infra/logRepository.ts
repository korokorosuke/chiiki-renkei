/// <reference lib="deno.unstable" />
import type { Log } from "../domain/log.ts"
import type { ILogRepository } from "../domain/logService.ts"
import { Kv } from "./kv.ts"

export class LogRepository implements ILogRepository {
  database: Kv
  base: string
  KEY: string = "log"
  constructor(base: string){
    this.database = new Kv();
    this.base = base;
  }
  async write(log: Log): Promise<boolean> {
    const kv = await this.database.open();
    const key = [this.base, this.KEY, log.datetime];
    const res = await kv.atomic().check({key, versionstamp: null})
      .set(key, log).commit();
    this.database.close();
    return res.ok;
  }
}