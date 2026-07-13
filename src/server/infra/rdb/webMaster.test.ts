import { WebMasterRepository } from "./webMasterRepository.ts"
import { insert, update, read, del } from "../testdata/webMaster.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

Deno.test("webmaster repository sqlite", async (t) => {
  const repo = new WebMasterRepository(BASE);
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("del", async () => {await del(repo);});
});