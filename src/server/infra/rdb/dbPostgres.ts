import type { Database } from "../database.ts"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { relations } from "../../db/relations.ts"
import { DB_URL } from "../../settings.ts"


export class Db implements Database{
  static test = false
  // deno-lint-ignore no-explicit-any
  private pool: any

  open(options?: object) {
    let filename = DB_URL;
    if(Db.test){
      filename = DB_URL + "test";
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