import { describe, test } from "vitest"
import { AppointmentRepository } from "./appointmentRepository.ts"
import { insert, update, read, list, patientList, reportList, del, prepare, cleanUp } from "./testdata/appointment.ts"
import { PatientRepository } from "./patientRepository.ts"
import { DepartmentRepository } from "./departmentRepository.ts"
import { DrRepository } from "./drRepository.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { UserRepository } from "./userRepository.ts"

import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("appointment repository", () => {
  const repo = new AppointmentRepository(BASE);
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
  test("reportList", async () => {await reportList(repo);});
  test("del", async () => {await del(repo);});
  test("cleanUp", async () => {await cleanUp(repoUser, repoPat, repoDept, repoDr, repoFac);});
});