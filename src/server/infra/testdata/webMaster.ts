import { assert, assertFalse, fail } from "@std/assert"
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

function compare(u1: WebMaster, u2: WebMaster): boolean {
  if(u1.dept !== u2.dept){
    return false;
  }
  if(u1.dr !== u2.dr){
    return false;
  }
  if(u1.week !== u2.week){
    return false;
  }
  if(u1.reservs.length === u2.reservs.length){
    for(let i = 0; i<u1.reservs.length; i++){
      if(u1.reservs[i].time !== u2.reservs[i].time){
        return false;
      }
      if(u1.reservs[i].max !== u2.reservs[i].max){
        return false;
      }
    }
  }else{
    return false;
  }
  return true;
}

export async function insert(repo: IWebMasterRepository){
  let res = await repo.insert(master);
  assert(res);
  res = await repo.insert(master2);
  assert(res);
  res = await repo.insert(master4);
  assert(res);
}
export async function update(repo: IWebMasterRepository){
  const res = await repo.update(master3);
  assert(res);
}
export async function read(repo: IWebMasterRepository){
  let res = await repo.read("02", "0001", 2);
  if(res){
      assert(compare(master2, res));
  }else{
      fail();
  }
  res = await repo.read("01", "0001", 2);
  if(res){
  assert(compare(master3, res));
  }else{
      fail();
  }
  res = await repo.read("01", "0001", 3);
  if(res){
  assert(compare(master4, res));
  }else{
      fail();
  }
}
export async function del(repo: IWebMasterRepository){
  await repo.delete(master3);
  let res = await repo.read(master3.dept, master3.dr, master3.week);
  assertFalse(res);
  await repo.delete(master2);
  res = await repo.read(master2.dept, master2.dr, master2.week);
  assertFalse(res);
  await repo.delete(master4);
  res = await repo.read(master4.dept, master4.dr, master4.week);
  assertFalse(res);
}