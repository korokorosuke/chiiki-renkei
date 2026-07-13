import { QuestionnaireRepository } from "./questionnaireRepository.ts"
import { insert, update, read, list, del } from "./testdata/questionnaire.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

Deno.test("questionnaire repository", async (t) => {
  const repo = new QuestionnaireRepository(BASE);
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("del", async () => {await del(repo);});
});