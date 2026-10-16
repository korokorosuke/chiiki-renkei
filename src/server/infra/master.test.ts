import { describe, test } from "vitest"
import { MasterRepository } from "./masterRepository.ts"
import { prepare, update, read } from "./testdata/master.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("master repository", () => {
  const repo = new MasterRepository(BASE);
  test("prepare", async () => {await prepare(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
});