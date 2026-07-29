import { InquiryRepository } from "./inquiryRepository.ts"
import { DueRepository } from "./dueRepository.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { PatientRepository } from "./patientRepository.ts"
import { UserRepository } from "./userRepository.ts"
import { insert, update, read, list, patientList, facilityList, del,
  prepare, cleanUp } from "../testdata/inquiry.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

Deno.test("inquiry repository rdb", async (t) => {
  const repo = new InquiryRepository(BASE);
  const repoDue = new DueRepository(BASE);
  const repoFac = new FacilityRepository(BASE);
  const repoPat = new PatientRepository(BASE);
  const repoUser = new UserRepository(BASE);
  await t.step("prepare", async () => {await prepare(repoDue, repoFac, repoPat, repoUser);});
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("patient", async () => {await patientList(repo);});
  await t.step("facility", async () => {await facilityList(repo);});
  await t.step("del", async () => {await del(repo);});
  await t.step("cleanUp", async () => {await cleanUp(repoDue, repoFac, repoPat, repoUser);});
});