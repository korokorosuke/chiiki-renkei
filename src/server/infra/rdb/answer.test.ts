import { AnswerRepository } from "./answerRepository.ts"
import { AppointmentRepository } from "./appointmentRepository.ts"
import { PatientRepository } from "./patientRepository.ts"
import { QuestionnaireRepository } from "./questionnaireRepository.ts"
import { prepare, insert, update, read, list, del, cleanUp } from "../testdata/answer.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

Deno.test("answer repository", async (t) => {
  const repoApp = new AppointmentRepository(BASE);
  const repo = new AnswerRepository(BASE);
  const repoPat = new PatientRepository(BASE);
  const repoQ = new QuestionnaireRepository(BASE);
  await t.step("prepare", async () => {await prepare(repoApp, repoPat, repoQ);});
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("del", async () => {await del(repo, repoApp);});
  await t.step("cleanUp", async () => {await cleanUp(repoPat, repoQ);});
});