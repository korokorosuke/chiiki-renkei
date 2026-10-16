import { describe, test } from "vitest"
import { StaffRepository } from "./staffRepository.ts"
import { insert, update, read, list, del } from "./testdata/staff.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("staff repository", () => {
  const repo = new StaffRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("del", async () => {await del(repo);});
});