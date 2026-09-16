/// <reference lib="deno.unstable" />
import type { Log } from "../domain/log.ts"
import type { ILogRepository } from "../domain/logService.ts"
import type { ILogListRepository } from "../domain/logListService.ts"
import { Kv } from "./kv.ts"
import { addDay, getNowWithMS } from "../lib/datetime.ts"

export class LogRepository implements ILogRepository, ILogListRepository {
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
    let res = {ok: false};
    for(let i = 0; i < 3; i++){
      res = await kv.atomic().check({key, versionstamp: null})
        .set(key, log).commit();
      if(res.ok){
        break;
      }else{
        log.datetime = getNowWithMS();
        i++;
      }
    }
    this.database.close();
    return res.ok;
  }

  private buildCondition(fromDate: string, toDate: string): Deno.KvListSelector {
    let fDate, tDate;
    if(fromDate){
        fDate = fromDate;
    }else{
        fDate = "1900-01-01";
    }
    if(toDate){
        tDate = addDay(toDate);
    }else{
        tDate = "2999-12-31";
    }
    return {start: [this.base, this.KEY, fDate], end: [this.base, this.KEY, tDate]};
  }

  async list(level: string, fromDate: string, toDate: string, userId: string, patientId: string): Promise<Log[]>{
    const key = this.buildCondition(fromDate, toDate);
    const kv = await this.database.open();
    const list: Log[] = [];
    const res = kv.list<Log>(key);
    if(res){
      for await (const r of res){
        if(level && r.value.level !== level){
          continue;
        }
        if(userId && r.value.userId !== userId){
          continue;
        }
        if(patientId && r.value.patientId !== patientId){
          continue;
        }
        list.push(r.value);
      }
    }
    this.database.close();
    return list;
  }
}