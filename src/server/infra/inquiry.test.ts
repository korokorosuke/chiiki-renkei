import { describe, test } from "vitest"
import { InquiryRepository } from "./inquiryRepository.ts"
import { insert, update, read, list, patientList, facilityList, del } from "./testdata/inquiry.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("inquiry repository", () => {
  const repo = new InquiryRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("patient", async () => {await patientList(repo);});
  test("facility", async () => {await facilityList(repo);});
  test("del", async () => {await del(repo);});
});