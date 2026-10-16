import { describe, test } from "vitest"
import { ReferralToRepository } from "./referraltoRepository.ts"
import { insert, update, read, list, patientList, del } from "./testdata/referralTo.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("referralto repository", () => {
  const repo = new ReferralToRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("patient", async () => {await patientList(repo);});
  test("del", async () => {await del(repo);});
});