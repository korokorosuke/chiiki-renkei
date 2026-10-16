import { expect } from "vitest"
import type { IWebMasterRepository } from "../../domain/webMasterService.ts"
import type { WebMaster } from "../../domain/webMaster.ts"

export const master: WebMaster = {
  dept: "01",
  dr: "0001",
  week: 2,
  reservs:[{
    time: "09:00",
    max: 3,
  }]
}
export const master2: WebMaster = {
  dept: "02",
  dr: "0001",
  week: 2,
  reservs:[{
    time: "09:00",
    max: 3,
  },
  {
    time: "09:30",
    max: 1,
  }]
}
export const master3: WebMaster = {
  dept: "01",
  dr: "0001",
  week: 2,
  reservs:[{
    time: "09:00",
    max: 3,
  },
  {
    time:"10:00",
    max:3
  }]
}
export const master4: WebMaster = {
  dept: "01",
  dr: "0001",
  week: 3,
  reservs:[{
    time: "09:00",
    max: 3,
  },
  {
    time:"10:00",
    max:3
  }]
}

export async function insert(repo: IWebMasterRepository){
  let res = await repo.insert(master);
  expect(res).toBe(true);
  res = await repo.insert(master2);
  expect(res).toBe(true);
  res = await repo.insert(master4);
  expect(res).toBe(true);
}
export async function update(repo: IWebMasterRepository){
  const res = await repo.update(master3);
  expect(res).toBe(true);
}
export async function read(repo: IWebMasterRepository){
  let res = await repo.read("02", "0001", 2);
  expect(master2).toEqual(res);
  res = await repo.read("01", "0001", 2);
  expect(master3).toEqual(res);
  res = await repo.read("01", "0001", 3);
  expect(master4).toEqual(res);
}
export async function del(repo: IWebMasterRepository){
  await repo.delete(master3);
  let res = await repo.read(master3.dept, master3.dr, master3.week);
  expect(res).toBeUndefined();
  await repo.delete(master2);
  res = await repo.read(master2.dept, master2.dr, master2.week);
  expect(res).toBeUndefined();
  await repo.delete(master4);
  res = await repo.read(master4.dept, master4.dr, master4.week);
  expect(res).toBeUndefined();
}