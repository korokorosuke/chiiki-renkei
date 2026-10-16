import { expect } from "vitest"
import type { IDrRepository } from "../../domain/drService.ts"
import type { Dr } from "../../domain/dr.ts"

export const dr: Dr = {
  id: "00001",
  name: "山田　太郎",
  department: "01",
}
export const dr2: Dr = {
  id: "00002",
  name: "山田　次郎",
  department: "02",
}
export const dr3: Dr = {
  id: "00001",
  name: "山田　太郎",
  department: "01",
}
export const dr4: Dr = {
  id: "00003",
  name: "山田　三郎",
  department: "02",
}

export async function insert(repo: IDrRepository){
  let res = await repo.insert(dr);
  expect(res).toBe(true);
  res = await repo.insert(dr2);
  expect(res).toBe(true);
  res = await repo.insert(dr4);
  expect(res).toBe(true);
}
export async function update(repo: IDrRepository){
  const res = await repo.update(dr3);
  expect(res).toBe(true);
}
export async function read(repo: IDrRepository){
  let res = await repo.read(dr.id);
  expect(dr3).toEqual(res);
  res = await repo.read(dr2.id);
  expect(dr2).toEqual(res);
}
export async function list(repo: IDrRepository){
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
export async function del(repo: IDrRepository){
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