import { MasterRepository } from "./masterRepository.ts"
import { prepare, update, read } from "../testdata/master.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

Deno.test("master repository sqlite", async (t) => {
  const repo = new MasterRepository(BASE);
  await t.step("prepare", async () => {await prepare(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
});