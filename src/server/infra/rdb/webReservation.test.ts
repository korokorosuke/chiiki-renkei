import { WebReservationRepository } from "./webReservationRepository.ts"
import { insert, update, read, list, del } from "../testdata/webReservation.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

Deno.test("webreservation repository sqlite", async (t) => {
  const repo = new WebReservationRepository(BASE);
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("del", async () => {await del(repo);});
});