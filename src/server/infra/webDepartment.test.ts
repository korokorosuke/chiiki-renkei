import { WebDepartmentRepository } from "./webDepartmentRepository.ts"
import { insert, update, read, all, del } from "./testdata/webDept.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

Deno.test("webdepartment repository", async (t) => {
  const repo = new WebDepartmentRepository(BASE);
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("all", async () => {await all(repo);});
  await t.step("del", async () => {await del(repo);});
});