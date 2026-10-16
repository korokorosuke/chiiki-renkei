import { describe, test } from "vitest"
import { WebMasterRepository } from "./webMasterRepository.ts"
import { insert, update, read, del } from "./testdata/webMaster.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("webmaster repository", () => {
  const repo = new WebMasterRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("del", async () => {await del(repo);});
});