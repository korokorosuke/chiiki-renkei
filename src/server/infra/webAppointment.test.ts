import { WebAppRepository } from "./webAppointmentRepository.ts"
import { prepare, insert, update, checkCount, read, list, patientList, del, cleanUp } from "./testdata/webAppointment.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"
import { WebReservationRepository } from "./webReservationRepository.ts"

Kv.test = true;

Deno.test("webappointment repository", async (t) => {
  const repoRes = new WebReservationRepository(BASE);
  const repo = new WebAppRepository(BASE);
  await t.step("prepare", async () => {await prepare(repoRes);});
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("checkCount", async () => {await checkCount(repoRes);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("patient", async () => {await patientList(repo);});
  await t.step("del", async () => {await del(repo);});
  await t.step("cleanUp", async () => {await cleanUp(repoRes);});
});