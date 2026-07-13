import { AddressRepository } from "./addressRepository.ts"
import { insert, update, read, del } from "./testdata/address.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

Deno.test("address repository", async (t) => {
  const repo = new AddressRepository();
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("del", async () => {await del(repo);});
});