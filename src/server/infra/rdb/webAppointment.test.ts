import { describe, test } from "vitest"
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

describe("webappointment repository rdb", () => {
  const repo = new WebAppRepository(BASE);
  const repoUser = new UserRepository(BASE);
  const repoPat = new PatientRepository(BASE);
  const repoDept = new WebDepartmentRepository(BASE);
  const repoDr = new WebDrRepository(BASE);
  const repoFac = new FacilityRepository(BASE);
  test("prepare", async () => {await prepare(
    repoUser, repoPat, repoDept, repoDr, repoFac);});
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("patient", async () => {await patientList(repo);});
  test("del", async () => {await del(repo);});
  test("cleanUp", async () => {await cleanUp(
    repoUser, repoPat, repoDept, repoDr, repoFac);});
});