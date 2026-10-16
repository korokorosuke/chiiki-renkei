import { expect } from "vitest"
import type { IWebDrRepository } from "../../domain/webDrService.ts"
import type { WebDr } from "../../domain/webDr.ts"

export const dr: WebDr = {
  id: "00001",
  name: "山田　太郎",
  displayName: "山田　太郎",
  department: "01",
}
export const dr2: WebDr = {
  id: "00002",
  name: "山田　次郎",
  displayName: "山田　次郎",
  department: "02",
}
export const dr3: WebDr = {
  id: "00001",
  name: "山田　太郎",
  displayName: "山田　太郎",
  department: "01",
}
export const dr4: WebDr = {
  id: "00003",
  name: "山田　三郎",
  displayName: "山田　三郎",
  department: "02",
}

export async function insert(repo: IWebDrRepository){
  let res = await repo.insert(dr);
  expect(res).toBe(true);
  res = await repo.insert(dr2);
  expect(res).toBe(true);
  res = await repo.insert(dr4);
  expect(res).toBe(true);
}
export async function update(repo: IWebDrRepository){
  const res = await repo.update(dr3);
  expect(res).toBe(true);
}
export async function read(repo: IWebDrRepository){
  let res = await repo.read(dr.id);
  expect(dr3).toEqual(res);
  res = await repo.read(dr2.id);
  expect(dr2).toEqual(res);
}
export async function list(repo: IWebDrRepository){
  let res = await repo.list("02");
  if(res.length === 2){
    expect(dr2).toEqual(res[0]);
    expect(dr4).toEqual(res[1]);
  }else{
    console.log(`list1: ${res.length}`);
    expect.fail();
  }
  res = await repo.list("01");
  if(res.length === 1){
    expect(dr3).toEqual(res[0]);
  }else{
    console.log(`list2: ${res.length}`);
    expect.fail();
  }
}
export async function del(repo: IWebDrRepository){
  await repo.delete(dr3);
  let res = await repo.read(dr.id);
  expect(res).toBeUndefined();
  await repo.delete(dr2);
  res = await repo.read(dr2.id);
  expect(res).toBeUndefined();
  await repo.delete(dr4);
  res = await repo.read(dr4.id);
  expect(res).toBeUndefined();
}