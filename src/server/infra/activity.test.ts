import { describe, test } from "vitest"
import { ActivityRepository } from "./activityRepository.ts"
import { insert, update, read, list, facilityList, del } from "./testdata/activity.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("activity repository", () => {
  const repo = new ActivityRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("facility", async () => {await facilityList(repo);});
  test("del", async () => {await del(repo);});
});