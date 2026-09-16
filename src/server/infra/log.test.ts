import { LogRepository } from "./logRepository.ts"
import { write, list } from "./testdata/log.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

Deno.test("Log repository", async (t) => {
  const repo = new LogRepository(BASE);
  await t.step("write", async () => {await write(repo);});
  await t.step("list", async () => {await list(repo);});
});