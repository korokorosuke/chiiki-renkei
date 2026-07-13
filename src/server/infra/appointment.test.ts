import { AppointmentRepository } from "./appointmentRepository.ts"
import { insert, update, read, list, patientList, del } from "./testdata/appointment.ts"

import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

Deno.test("appointment repository", async (t) => {
  const repo = new AppointmentRepository(BASE);
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("patient", async () => {await patientList(repo);});
  await t.step("del", async () => {await del(repo);});
});