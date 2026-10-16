import { describe, test } from "vitest"
import { DrRepository } from "./drRepository.ts"
import { insert, update, read, list, del } from "./testdata/dr.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("dr repository", () => {
  const repo = new DrRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("del", async () => {await del(repo);});
});