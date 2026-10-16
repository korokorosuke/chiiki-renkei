import { describe, test } from "vitest"
import { WebAppRepository } from "./webAppointmentRepository.ts"
import { insert, update, read, list, patientList, del } from "./testdata/webAppointment.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("webappointment repository", () => {
  const repo = new WebAppRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("patient", async () => {await patientList(repo);});
  test("del", async () => {await del(repo);});
});