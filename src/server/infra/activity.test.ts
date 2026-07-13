import { ActivityRepository } from "./activityRepository.ts"
import { insert, update, read, list, facilityList, del } from "./testdata/activity.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

Deno.test("activity repository", async (t) => {
  const repo = new ActivityRepository(BASE);
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("facility", async () => {await facilityList(repo);});
  await t.step("del", async () => {await del(repo);});
});