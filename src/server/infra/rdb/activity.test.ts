import { ActivityRepository } from "./activityRepository.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { UserRepository } from "./userRepository.ts"
import { insert, update, read, list, facilityList, del, prepare, cleanUp } from "../testdata/activity.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

Deno.test("activity repository sqlite", async (t) => {
  const repo = new ActivityRepository(BASE);
  const repoFac = new FacilityRepository(BASE);
  const repoUser = new UserRepository(BASE);
  await t.step("prepare", async () => {await prepare(repoFac, repoUser);});
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("facility", async () => {await facilityList(repo);});
  await t.step("del", async () => {await del(repo);});
  await t.step("cleanUp", async () => {await cleanUp(repoFac, repoUser);});
});