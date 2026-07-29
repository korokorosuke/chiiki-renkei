import { defineConfig } from "drizzle-kit"
import { DB_TYPE, DB_URL } from "./src/server/settings"

export default defineConfig({
  dialect: DB_TYPE,
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    url: DB_URL// + "test"
  },
});