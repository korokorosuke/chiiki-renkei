import { describe, test } from "vitest"
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

describe("referralto repository rdb", () => {
  const repo = new ReferralToRepository(BASE);
  const repoUser = new UserRepository(BASE);
  const repoPat = new PatientRepository(BASE);
  const repoDept = new DepartmentRepository(BASE);
  const repoDr = new DrRepository(BASE);
  const repoFac = new FacilityRepository(BASE);
  test("prepare", async () => {await prepare(repoUser, repoPat, repoDept, repoDr, repoFac);});
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("patient", async () => {await patientList(repo);});
  test("del", async () => {await del(repo);});
  test("cleanUp", async () => {await cleanUp(repoUser, repoPat, repoDept, repoDr, repoFac);});
});