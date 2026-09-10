import type { Base } from "../../domain/base.ts"
import type { IBaseRepository } from "../../domain/baseService.ts"
import { Db } from "./db.ts"
import { base } from "../../db/schema.ts"
import { fatal } from "../../lib/log.ts"

export class BaseRepository implements IBaseRepository {
  database: Db
  constructor(){
    this.database = new Db();
  }

  async insert(val: Base): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(base).values(val);
      return true;
    }catch(e){
      await fatal(`${this.constructor.name} insert`, e, val.id);
      return false;
    }finally{
      this.database.close();
    }
  }

  async read(id: string): Promise<Base|undefined> {
    const db = await this.database.open();
    const res = await db.query.base.findFirst({
      where: {
        id: id
      }
    });
    if(res){
      return res;
    }
    return undefined;
  }
}