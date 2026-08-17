import { defineConfig } from "drizzle-kit"
import { DB_TYPE_KEY, DB_PG_URL_KEY, DB_SQLITE_URL_KEY } from "./src/server/settings"

export type DbType = "postgresql" | "sqlite";
const DB_TYPE: DbType = Deno.env.get(DB_TYPE_KEY) as DbType;

if(!DB_TYPE) {
  throw new Error("DB_TYPE is not set");
}

let key = "";
if(DB_TYPE === "postgresql") {
  key = DB_PG_URL_KEY;
}else if(DB_TYPE === "sqlite") {
  key = DB_SQLITE_URL_KEY;
}
export const DB_URL = Deno.env.get(key) ?? "";

export default defineConfig({
  dialect: DB_TYPE,
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    url: DB_URL// + "test"
  },
});