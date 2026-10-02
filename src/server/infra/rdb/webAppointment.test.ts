import { WebAppRepository } from "./webAppointmentRepository.ts"
import { prepare, insert, update, read, list, patientList, del, cleanUp } from "../testdata/webAppointment.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"
import { PatientRepository } from "./patientRepository.ts"
import { WebDepartmentRepository } from "./webDepartmentRepository.ts"
import { WebDrRepository } from "./webDrRepository.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { UserRepository } from "./userRepository.ts"

Db.test = true;

Deno.test("webappointment repository rdb", async (t) => {
  const repo = new WebAppRepository(BASE);
  const repoUser = new UserRepository(BASE);
  const repoPat = new PatientRepository(BASE);
  const repoDept = new WebDepartmentRepository(BASE);
  const repoDr = new WebDrRepository(BASE);
  const repoFac = new FacilityRepository(BASE);
  await t.step("prepare", async () => {await prepare(
    repoUser, repoPat, repoDept, repoDr, repoFac);});
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("patient", async () => {await patientList(repo);});
  await t.step("del", async () => {await del(repo);});
  await t.step("cleanUp", async () => {await cleanUp(
    repoUser, repoPat, repoDept, repoDr, repoFac);});
});