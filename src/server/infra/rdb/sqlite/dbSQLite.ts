import type { Database } from "../../database.ts"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import { relations } from "../../../db/relationsSQLite.ts"
import { DB_URL } from "../../../settings.ts"


export class Db implements Database{
  static test = false

  async open(options?: object) {
    let filename = "file:" + DB_URL;
    if(Db.test){
      filename = "file:test.db";
    }
    const sqlite = createClient({ url: filename });
    await sqlite.execute("PRAGMA busy_timeout = 5000;");
    return Promise.resolve(drizzle({...options, client: sqlite, relations }));
  }

  close(): void {
    //this.db?.close();
  }

  get(){
    return this.open();
  }
}