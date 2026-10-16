import { describe, test } from "vitest"
import { LogRepository } from "./logRepository.ts"
import { write, list } from "./testdata/log.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("Log repository", () => {
  const repo = new LogRepository(BASE);
  test("write", async () => {await write(repo);});
  test("list", async () => {await list(repo);});
});