import { NoticeRepository } from "./noticeRepository.ts"
import { insert, update, read, list, all, del } from "../testdata/notice.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

Deno.test("notice repository sqlite", async (t) => {
  const repo = new NoticeRepository(BASE);
  await t.step("insert", async () => {await insert(repo);});
  await t.step("update", async () => {await update(repo);});
  await t.step("read", async () => {await read(repo);});
  await t.step("list", async () => {await list(repo);});
  await t.step("all", async () => {await all(repo);});
  await t.step("del", async () => {await del(repo);});
});