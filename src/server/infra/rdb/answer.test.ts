import { describe, test } from "vitest"
import { AnswerRepository } from "./answerRepository.ts"
import { AppointmentRepository } from "./appointmentRepository.ts"
import { PatientRepository } from "./patientRepository.ts"
import { QuestionnaireRepository } from "./questionnaireRepository.ts"
import { prepare, insert, update, read, list, del, cleanUp } from "../testdata/answer.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

describe("answer repository", () => {
  const repoApp = new AppointmentRepository(BASE);
  const repo = new AnswerRepository(BASE);
  const repoPat = new PatientRepository(BASE);
  const repoQ = new QuestionnaireRepository(BASE);
  test("prepare", async () => {await prepare(repoApp, repoPat, repoQ);});
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("del", async () => {await del(repo, repoApp);});
  test("cleanUp", async () => {await cleanUp(repoPat, repoQ);});
});