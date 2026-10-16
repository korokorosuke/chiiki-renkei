import { describe, test } from "vitest"
import { DepartmentRepository } from "./departmentRepository.ts"
import { insert, update, read, exam, all, del } from "../testdata/dept.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

describe("department repository rdb", () => {
  const repo = new DepartmentRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("exam", async () => {await exam(repo);});
  test("all", async () => {await all(repo);});
  test("del", async () => {await del(repo);});
});