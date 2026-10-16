import { describe, test } from "vitest"
import { DepartmentRepository } from "./departmentRepository.ts"
import { insert, update, read, all, exam, del } from "./testdata/dept.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("department repository", () => {
  const repo = new DepartmentRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("exam", async () => {await exam(repo);});
  test("all", async () => {await all(repo);});
  test("del", async () => {await del(repo);});
});