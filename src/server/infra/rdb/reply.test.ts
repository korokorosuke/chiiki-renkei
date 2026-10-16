import { describe, test } from "vitest"
import { AppointmentRepository } from "./appointmentRepository.ts"
import { ReplyRepository } from "./replyRepository.ts"
import { insert, update, read, list, del, prepare, cleanUp } from "../testdata/reply.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"
import { PatientRepository } from "./patientRepository.ts"
import { DepartmentRepository } from "./departmentRepository.ts"
import { DrRepository } from "./drRepository.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { UserRepository } from "./userRepository.ts"
import { ClassificationRepository } from "./classificationRepository.ts"

Db.test = true;

describe("reply repository rdb", () => {
const repoApp = new AppointmentRepository(BASE);
const repo = new ReplyRepository(BASE);
const repoUser = new UserRepository(BASE);
const repoPat = new PatientRepository(BASE);
const repoDept = new DepartmentRepository(BASE);
const repoDr = new DrRepository(BASE);
const repoFac = new FacilityRepository(BASE);
const repoCls = new ClassificationRepository(BASE);
test("prepare", async () => {await prepare(repoApp,
  repoUser, repoPat, repoDept, repoDr, repoFac, repoCls);});
test("insert", async () => {await insert(repo);});
test("update", async () => {await update(repo);});
test("read", async () => {await read(repo);});
test("list", async () => {await list(repo);});
test("del", async () => {await del(repo, repoApp);});
test("cleanUp", async () => {await cleanUp(repoUser, repoPat, repoDept, repoDr, repoFac, repoCls);});
});