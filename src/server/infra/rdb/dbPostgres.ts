import type { Database } from "../database.ts"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { relations } from "../../db/relations.ts"
import { DB_PG_URL_KEY } from "../../settings.ts"


export class Db implements Database{
  static test = false
  // deno-lint-ignore no-explicit-any
  private pool: any

  open(options?: object) {
    let filename = Deno.env.get(DB_PG_URL_KEY);
    if(!filename){
      return Promise.reject(new Error("DB_URL is not set"));
    }
    if(Db.test){
      filename = filename + "test";
    }
    this.pool = new Pool({
      connectionString: filename
    });
    return Promise.resolve(drizzle({...options, client: this.pool, relations }));
  }

  close(): void {
    this.pool?.end();
  }

  get(){
    return this.open();
  }
}