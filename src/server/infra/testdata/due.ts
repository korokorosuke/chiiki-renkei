import { expect } from "vitest"
import type { IDueRepository } from "../../domain/dueService.ts"
import type { Due } from "../../domain/due.ts"

export const due: Due = {
  id: 1,
  name: "当日",
  days: 0
}
export const due2: Due = {
  id: 2,
  name: "翌日",
  days: 1
}
export const due3: Due = {
  id: 1,
  name: "本日",
  days: 0
}
export const due4: Due = {
  id: 3,
  name: "翌日",
  days: -1
}

export async function insert(repo: IDueRepository){
  let res = await repo.insert(due);
  expect(res).toBe(true);
  res = await repo.insert(due2);
  expect(res).toBe(true);
  res = await repo.insert(due4);
  expect(res).toBe(true);
}
export async function update(repo: IDueRepository){
  const res = await repo.update(due3);
  expect(res).toBe(true);
}
export async function read(repo: IDueRepository){
  let res = await repo.read(due.id);
  expect(due3).toEqual(res);
  res = await repo.read(due2.id);
  expect(due2).toEqual(res);
}
export async function all(repo: IDueRepository){
  const res = await repo.all();
  if(res.length === 3){
    for(const r of res){
      if(r.id === due3.id){
        expect(due3).toEqual(r);
      }else if(r.id === due2.id){
        expect(due2).toEqual(r);
      }else if(r.id === due4.id){
        expect(due4).toEqual(r);
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`list2: ${res.length}`);
    expect.fail();
  }
}
export async function del(repo: IDueRepository){
  await repo.delete(due);
  let res = await repo.read(due3.id);
  expect(res).toBeUndefined();
  await repo.delete(due2);
  res = await repo.read(due2.id);
  expect(res).toBeUndefined();
  await repo.delete(due4);
  res = await repo.read(due4.id);
  expect(res).toBeUndefined();
}