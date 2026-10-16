import { expect } from "vitest"
import type { IClassificationRepository } from "../../domain/classificationService.ts"
import type { Classification } from "../../domain/classification.ts"

export const classification1: Classification = {
  id: "01",
  name: "一報",
  done: false,
}
export const classification2: Classification = {
  id: "02",
  name: "最終",
  done: true,
}
export const classification3: Classification = {
  id: "01",
  name: "二報",
  done: false,
}
export const classification4: Classification = {
  id: "50",
  name: "経過",
  done: false,
}

export async function insert(repo: IClassificationRepository){
  let res = await repo.insert(classification1);
  expect(res).toBe(true);
  res = await repo.insert(classification2);
  expect(res).toBe(true);
  res = await repo.insert(classification4);
  expect(res).toBe(true);
}
export async function update(repo: IClassificationRepository){
  const res = await repo.update(classification3);
  expect(res).toBe(true);
}
export async function read(repo: IClassificationRepository){
  let res = await repo.read(classification1.id);
  expect(classification3).toEqual(res);
  res = await repo.read(classification2.id);
  expect(classification2).toEqual(res);
}
export async function all(repo: IClassificationRepository){
  const res = await repo.all();
  if(res.length === 3){
    for(const r of res){
      if(r.id === classification3.id) {
        expect(classification3).toEqual(r);
      }else if(r.id === classification2.id) {
        expect(classification2).toEqual(r);
      }else if(r.id === classification4.id) {
        expect(classification4).toEqual(r);
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`all: ${res.length}`);
    expect.fail();
  }
}
export async function del(repo: IClassificationRepository){
  await repo.delete(classification1);
  let res = await repo.read(classification1.id);
  expect(res).toBeUndefined();
  await repo.delete(classification2);
  res = await repo.read(classification2.id);
  expect(res).toBeUndefined();
  await repo.delete(classification4);
  res = await repo.read(classification4.id);
  expect(res).toBeUndefined();
}