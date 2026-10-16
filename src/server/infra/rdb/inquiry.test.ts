import { describe, test } from "vitest"
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

describe("inquiry repository rdb", () => {
  const repo = new InquiryRepository(BASE);
  const repoDue = new DueRepository(BASE);
  const repoFac = new FacilityRepository(BASE);
  const repoPat = new PatientRepository(BASE);
  const repoUser = new UserRepository(BASE);
  test("prepare", async () => {await prepare(repoDue, repoFac, repoPat, repoUser);});
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("patient", async () => {await patientList(repo);});
  test("facility", async () => {await facilityList(repo);});
  test("del", async () => {await del(repo);});
  test("cleanUp", async () => {await cleanUp(repoDue, repoFac, repoPat, repoUser);});
});