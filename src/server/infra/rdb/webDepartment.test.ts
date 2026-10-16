import { describe, test } from "vitest"
import { WebDepartmentRepository } from "./webDepartmentRepository.ts"
import { insert, update, read, all, del } from "../testdata/webDept.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

describe("webDepartment repository rdb", () => {
  const repo = new WebDepartmentRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("all", async () => {await all(repo);});
  test("del", async () => {await del(repo);});
});