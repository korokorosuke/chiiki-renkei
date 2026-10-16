import { expect } from "vitest"
import type { IMasterRepository } from "../../domain/masterService.ts"

const data = ["あああ","いいい","ううう"];
const data2 = ["あああ","いいい","うううう"];
const data3 = ["あああ","いいい","うううう","えええ"];

export async function prepare(repo: IMasterRepository){
  const res = await repo.update("kind", data);
  expect(res).toBe(true);
}
export async function update(repo: IMasterRepository){
  let res = await repo.update("kind", data2);
  expect(res).toBe(true);
  res = await repo.update("kind", data3);
  expect(res).toBe(true);
}
export async function read(repo: IMasterRepository){
  const res = await repo.read("kind");
  expect(data3).toEqual(res);
}