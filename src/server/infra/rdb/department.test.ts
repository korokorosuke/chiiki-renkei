import { DepartmentRepository } from "./departmentRepository.ts"
import { insert, update, read, exam, all, del } from "../testdata/dept.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

Deno.test("department repository sqlite", async (t) => {
  const repo = new DepartmentRepository(BASE);
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("exam", async () => {await exam(repo);});
  await t.step("all", async () => {await all(repo);});
  await t.step("del", async () => {await del(repo);});
});