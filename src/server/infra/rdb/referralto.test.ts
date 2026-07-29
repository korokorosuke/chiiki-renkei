import { ReferralToRepository } from "./referraltoRepository.ts"
import { insert, update, read, list, patientList, del, prepare, cleanUp } from "../testdata/referralTo.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"
import { PatientRepository } from "./patientRepository.ts"
import { DepartmentRepository } from "./departmentRepository.ts"
import { DrRepository } from "./drRepository.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { UserRepository } from "./userRepository.ts"

Db.test = true;

Deno.test("referralto repository rdb", async (t) => {
  const repo = new ReferralToRepository(BASE);
  const repoUser = new UserRepository(BASE);
  const repoPat = new PatientRepository(BASE);
  const repoDept = new DepartmentRepository(BASE);
  const repoDr = new DrRepository(BASE);
  const repoFac = new FacilityRepository(BASE);
  await t.step("prepare", async () => {await prepare(repoUser, repoPat, repoDept, repoDr, repoFac);});
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("patient", async () => {await patientList(repo);});
  await t.step("del", async () => {await del(repo);});
  await t.step("cleanUp", async () => {await cleanUp(repoUser, repoPat, repoDept, repoDr, repoFac);});
});