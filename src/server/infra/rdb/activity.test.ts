import { describe, test } from "vitest"
import { ActivityRepository } from "./activityRepository.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { UserRepository } from "./userRepository.ts"
import { insert, update, read, list, facilityList, del, prepare, cleanUp } from "../testdata/activity.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

describe("activity repository rdb", () => {
  const repo = new ActivityRepository(BASE);
  const repoFac = new FacilityRepository(BASE);
  const repoUser = new UserRepository(BASE);
  test("prepare", async () => {await prepare(repoFac, repoUser);});
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("facility", async () => {await facilityList(repo);});
  test("del", async () => {await del(repo);});
  test("cleanUp", async () => {await cleanUp(repoFac, repoUser);});
});