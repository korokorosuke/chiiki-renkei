import { describe, test } from "vitest"
import { AddressRepository } from "./addressRepository.ts"
import { insert, update, read, del } from "../testdata/address.ts"
import { Db } from "./db.ts"

Db.test = true;

describe("address repository rdb", () => {
  const repo = new AddressRepository();
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("del", async () => {await del(repo);});
});