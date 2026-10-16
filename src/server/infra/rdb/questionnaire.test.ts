import { describe, test } from "vitest"
import { QuestionnaireRepository } from "./questionnaireRepository.ts"
import { insert, update, read, list, del } from "../testdata/questionnaire.ts"
import { BASE } from "../testdata/settings.ts"
import { Db } from "./db.ts"

Db.test = true;

describe("questionnaire repository rdb", () => {
  const repo = new QuestionnaireRepository(BASE);
  test("insert", async () => {await insert(repo);});
  test("update", async () => {await update(repo);});
  test("read", async () => {await read(repo);});
  test("list", async () => {await list(repo);});
  test("del", async () => {await del(repo);});
});