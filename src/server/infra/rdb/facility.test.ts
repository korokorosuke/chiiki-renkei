import { FacilityRepository } from "./facilityRepository.ts"
import { insert, update, read, list, del } from "../testdata/facility.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

Deno.test("facility repository rdb", async (t) => {
  const repo = new FacilityRepository(BASE);
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("del", async () => {await del(repo);});
});