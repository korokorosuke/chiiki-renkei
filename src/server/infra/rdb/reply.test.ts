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

Deno.test("reply repository rdb", async (t) => {
const repoApp = new AppointmentRepository(BASE);
const repo = new ReplyRepository(BASE);
const repoUser = new UserRepository(BASE);
const repoPat = new PatientRepository(BASE);
const repoDept = new DepartmentRepository(BASE);
const repoDr = new DrRepository(BASE);
const repoFac = new FacilityRepository(BASE);
const repoCls = new ClassificationRepository(BASE);
await t.step("prepare", async () => {await prepare(repoApp,
  repoUser, repoPat, repoDept, repoDr, repoFac, repoCls);});
await t.step("insert", async () => {await insert(repo);});
await t.step("update", async () => {await update(repo);});
await t.step("read", async () => {await read(repo);});
await t.step("list", async () => {await list(repo);});
await t.step("del", async () => {await del(repo, repoApp);});
await t.step("cleanUp", async () => {await cleanUp(repoUser, repoPat, repoDept, repoDr, repoFac, repoCls);});
});