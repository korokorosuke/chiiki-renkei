import { describe, test } from "vitest"
import { AppointmentRepository } from "./appointmentRepository.ts"
import { ReplyRepository } from "./replyRepository.ts"
import { prepare, insert, update, read, list, del } from "./testdata/reply.ts"
import { BASE } from "./testdata/settings.ts"
import { Kv } from "./kv.ts"

Kv.test = true;

describe("reply repository", () => {
const repoApp = new AppointmentRepository(BASE);
const repo = new ReplyRepository(BASE);
test("prepare", async () => {await prepare(repoApp);});
test("insert", async () => {await insert(repo);});
test("update", async () => {await update(repo);});
test("read", async () => {await read(repo);});
test("list", async () => {await list(repo);});
test("del", async () => {await del(repo, repoApp);});
});