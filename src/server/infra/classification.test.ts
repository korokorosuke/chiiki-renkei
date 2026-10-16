import { describe, test } from "vitest"
import { ClassificationRepository } from "./classificationRepository.ts"
import { insert, update, read, all, del } from "./testdata/classification.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("classification repository", () => {
  const repo = new ClassificationRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("all", async () => {await all(repo);});
  test("del", async () => {await del(repo);});
});