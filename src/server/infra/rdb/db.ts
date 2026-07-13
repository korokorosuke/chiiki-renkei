import type { Database } from "../database.ts"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { relations } from "../../db/relations.ts"

export class Db implements Database{
  static test = false

  async open(options?: object) {
    let filename = "file:reco.db";
    if(Db.test){
      filename = "file:test.db";
    }
    const sqlite = createClient({ url: filename });
    await sqlite.execute("PRAGMA busy_timeout = 5000;");
    return Promise.resolve(drizzle({...options, client: sqlite, casing: "snake_case", relations }));
  }

  close(): void {
    //this.db?.close();
  }

  get(){
    return this.open();
  }
}