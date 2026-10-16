import { describe, test } from "vitest"
import { FacilityRepository } from "./facilityRepository.ts"
import { insert, update, read, list, del } from "./testdata/facility.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("facility repository", () => {
  const repo = new FacilityRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("del", async () => {await del(repo);});
});