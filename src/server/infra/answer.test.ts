import { AnswerRepository } from "./answerRepository.ts"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import { prepare, insert, update, read, list, del } from "./testdata/answer.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

Deno.test("answer repository", async (t) => {
  const repoApp = new AppointmentRepository(BASE);
  const repo = new AnswerRepository(BASE);
  await t.step("prepare", async () => {await prepare(repoApp);});
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("del", async () => {await del(repo, repoApp);});
});