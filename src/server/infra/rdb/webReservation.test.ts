import { describe, test } from "vitest"
import { WebReservationRepository } from "./webReservationRepository.ts"
import { insert, update, read, list, del } from "../testdata/webReservation.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

describe("webreservation repository rdb", () => {
  const repo = new WebReservationRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("del", async () => {await del(repo);});
});