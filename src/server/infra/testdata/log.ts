import { assert } from "@std/assert"
import type { ILogRepository } from "../../domain/logService.ts"
import type { ILogListRepository } from "../../domain/logListService.ts"
import type { Log } from "../../domain/log.ts"
import { getNowWithMS } from "../../lib/datetime.ts"

const BASE_DATETIME = getNowWithMS();

export const log1: Log = {
  level: "info",
  datetime: "",
  title: "title1",
  details: "details1",
  userId: "",
  patientId: "",
}

export const log2: Log = {
  level: "info",
  datetime: "",
  title: "title1",
  details: "details1",
  userId: "0001",
  patientId: "A",
}

export const log3: Log = {
  level: "error",
  datetime: "",
  title: "title1",
  details: "details1",
  userId: "0001",
  patientId: "B",
}

export const log4: Log = {
  level: "fatal",
  datetime: "",
  title: "title1",
  details: "details1",
  userId: "",
  patientId: "A",
}

export async function write(repo: ILogRepository){
  log1.datetime = getNowWithMS();
  let res = await repo.write(log1);
  assert(res);
  log2.datetime = getNowWithMS();
  res = await repo.write(log2);
  assert(res);
  log3.datetime = getNowWithMS();
  res = await repo.write(log3);
  assert(res);
  log4.datetime = getNowWithMS();
  res = await repo.write(log4);
  assert(res);
}
export async function list(repo: ILogListRepository){
  const res = await repo.list("", BASE_DATETIME, "", "", "");
  assert(res.length === 4);
  const res1 = await repo.list("info", BASE_DATETIME, "", "", "");
  assert(res1.length === 2);
  const res2 = await repo.list("", BASE_DATETIME, "", "0001", "");
  assert(res2.length === 2);
  const res3 = await repo.list("", BASE_DATETIME, "", "", "A");
  assert(res3.length === 2);
  const res4 = await repo.list("fatal", BASE_DATETIME, "", "", "A");
  assert(res4.length === 1);
  const res5 = await repo.list("error", BASE_DATETIME, getNowWithMS(), "0001", "B");
  assert(res5.length === 1);
}