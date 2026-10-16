import { expect } from "vitest"
import type { IStaffRepository } from "../../domain/staffService.ts"
import type { Staff } from "../../domain/staff.ts"
import { user } from "./user.ts"

export const staff: Staff = {
  id: "00001",
  name: "山田　太郎",
  kana: "",
  department: "01",
  dr: true,
  post: "院長",
  facilityId: "00001",
  sort: 1,
  hidden: false,
  updatedBy: user,
  updatedAt: "2020-01-01T00:00:00Z",
}
export const staff2: Staff = {
  id: "00002",
  name: "山田　次郎",
  kana: "",
  department: "02",
  dr: false,
  post: "",
  facilityId: "00001",
  sort: 2,
  hidden: true,
  updatedBy: user,
  updatedAt: "2020-01-01T00:00:00Z"
}
export const staff3: Staff = {
  id: "00001",
  name: "山田　太郎",
  kana: "",
  department: "01",
  dr: true,
  post: "院長",
  facilityId: "00001",
  sort: 2,
  hidden: false,
  updatedBy: user,
  updatedAt: "2020-01-01T00:00:00Z"
}
export const staff4: Staff = {
  id: "00003",
  name: "山田　三郎",
  kana: "",
  department: "02",
  dr: true,
  post: "",
  facilityId: "00002",
  sort: 2,
  hidden: false,
  updatedBy: user,
  updatedAt: "2020-01-01T00:00:00Z"
}

function omitTimestamps(val: Staff|undefined): Omit<Staff, "updatedAt"|"updatedBy">|undefined {
  if(val){
    const {updatedAt, updatedBy, ...value} = val;
    return value;
  }else{
    return undefined;
  }
}

export async function insert(repo: IStaffRepository){
  let res = await repo.insert(staff);
  expect(res).toBe(true);
  res = await repo.insert(staff2);
  expect(res).toBe(true);
  res = await repo.insert(staff4);
  expect(res).toBe(true);
}
export async function update(repo: IStaffRepository){
  const res = await repo.update(staff3);
  expect(res).toBe(true);
}
export async function read(repo: IStaffRepository){
  let res = await repo.read(staff.id);
  expect(omitTimestamps(staff3)).toEqual(omitTimestamps(res));
  res = await repo.read(staff2.id);
  expect(omitTimestamps(staff2)).toEqual(omitTimestamps(res));
}
export async function list(repo: IStaffRepository){
  let res = await repo.list({facilityid: "00001", dr: false, hidden: true});
  if(res.length === 2){
    for(const r of res){
      if(staff3.id === r.id){
        expect(omitTimestamps(staff3)).toEqual(omitTimestamps(r));
      }else if(staff2.id === r.id){
        expect(omitTimestamps(staff2)).toEqual(omitTimestamps(r));
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`list1: ${res.length}`);
    expect.fail();
  }
  res = await repo.list({facilityid: "00001", dr: false, hidden: false});
  if(res.length === 1){
    expect(omitTimestamps(staff3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`list2: ${res.length}`);
    expect.fail();
  }
  res = await repo.list({facilityid: "00002", dr: true, hidden: true});
  if(res.length === 1){
    expect(omitTimestamps(staff4)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`list3: ${res.length}`);
    expect.fail();
  }
}
export async function del(repo: IStaffRepository){
  await repo.delete(staff);
  let res = await repo.read(staff.id);
  expect(res).toBeUndefined();
  await repo.delete(staff2);
  res = await repo.read(staff2.id);
  expect(res).toBeUndefined();
  await repo.delete(staff4);
  res = await repo.read(staff4.id);
  expect(res).toBeUndefined();
}