import { describe, test } from "vitest"
import { LogRepository } from "./logRepository.ts"
import { write, list } from "../testdata/log.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

describe("Log repository rdb", () => {
  const repo = new LogRepository(BASE);
  test("write", async () => {await write(repo);});
  test("list", async () => {await list(repo);});
});