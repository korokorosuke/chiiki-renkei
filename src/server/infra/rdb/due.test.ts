import { describe, test } from "vitest"
import { DueRepository } from "./dueRepository.ts"
import { insert, update, read, all, del } from "../testdata/due.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

describe("due repository rdb", () => {
  const repo = new DueRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("all", async () => {await all(repo);});
  test("del", async () => {await del(repo);});
});