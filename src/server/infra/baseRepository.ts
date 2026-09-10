/// <reference lib="deno.unstable" />
import type { Base } from "../domain/base.ts"
import type { IBaseRepository } from "../domain/baseService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

export class BaseRepository implements IBaseRepository {
  database: Kv
  KEY: string = "base"
  constructor(){
    this.database = new Kv();
  }
  async insert(base: Base): Promise<boolean> {
    const kv = await this.database.open();
    const key = [this.KEY, base.id];
    const res = await kv.atomic().check({key, versionstamp: null})
        .set(key, base).commit();
    this.database.close();
    if(!res.ok){
        await fatal(`${this.constructor.name} insert`, "失敗しました", base.id);
    }
    return res.ok;
  }
  async read(id: string): Promise<Base|undefined> {
    const kv = await this.database.open();
    const res = await kv.get<Base>([this.KEY, id]);
    this.database.close();
    if(res?.value){
        return res.value;
    }
    return undefined;
  }
}