import { ClassificationRepository } from "./classificationRepository.ts"
import { insert, update, read, all, del } from "../testdata/classification.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

Deno.test("classification repository rdb", async (t) => {
  const repo = new ClassificationRepository(BASE);
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("all", async () => {await all(repo);});
  await t.step("del", async () => {await del(repo);});
});