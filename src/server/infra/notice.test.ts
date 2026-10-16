import { describe, test } from "vitest"
import { NoticeRepository } from "./noticeRepository.ts"
import { insert, update, read, list, all, del } from "./testdata/notice.ts"

import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("notice repository", () => {
  const repo = new NoticeRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("all", async () => {await all(repo);});
  test("del", async () => {await del(repo);});
});