import { expect } from "vitest"
import type { IActivityRepository } from "../../domain/activityService.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { IUserRepository } from "../../domain/userService.ts"
import type { Activity } from "../../domain/activity.ts"
import { facility, facility2, toFac } from "./facility.ts"
import { user, toUser } from "./user.ts"

export const activity: Activity = {
  id: "0001-00001",
  date: "2024-06-07T10:30",
  toDate: "",
  facility: toFac(facility),
  participants: "参加者",
  facilityParticipants: "施設参加者",
  details: "といあわせがありました",
  purpose: ["脳卒中"],
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T10:30",
}
export const activity2: Activity = {
  id: "0002-11111",
  date: "2024-06-08T14:00",
  toDate: "",
  facility: toFac(facility),
  participants: "参加者",
  facilityParticipants: "施設参加者",
  details: "といあわせがありました",
  purpose: ["糖尿病", "胃がん"],
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T10:30",
}
export const activity3: Activity = {
  id: "0001-00001",
  date: "2024-06-10T10:30",
  toDate: "",
  facility: toFac(facility),
  participants: "参加者",
  facilityParticipants: "施設参加者",
  details: "といあわせがありました",
  purpose: ["脳卒中"],
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T10:30",
}
export const activity4: Activity = {
  id: "0002-11111",
  date: "2024-06-08T14:00",
  toDate: "",
  facility: toFac(facility2),
  participants: "参加者",
  facilityParticipants: "施設参加者",
  details: "といあわせがありました",
  purpose: ["糖尿病", "胃がん"],
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T10:30Z",
}
export const activity5: Activity = {
  id: "0003-00001",
  date: "2024-06-08T10:30",
  toDate: "",
  facility: toFac(facility),
  participants: "参加者",
  facilityParticipants: "施設参加者",
  details: "といあわせがありました",
  purpose: ["糖尿病"],
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T10:30Z",
}
export const activity6: Activity = {
  id: "0003-00001",
  date: "2024-06-08T10:30",
  toDate: "",
  facility: toFac(facility),
  participants: "参加者",
  facilityParticipants: "施設参加者",
  details: "といあわせがありました",
  purpose: ["糖尿病", "脳卒中"],
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T10:30Z",
}

function omitTimestamps(val: Activity|undefined): Omit<Activity, "updatedAt">|undefined {
  if(val){
    const {updatedAt, ...value} = val;
    return value;
  }
  return undefined;
}

export async function prepare(repoFac: IFacilityRepository, repoUser: IUserRepository){
  await repoFac.insert(facility);
  await repoFac.insert(facility2);
  await repoUser.insert(user);
}

export async function insert(repo: IActivityRepository){
  let res = await repo.insert(activity);
  expect(res).toBe(true);
  res = await repo.insert(activity2);
  expect(res).toBe(true);
  res = await repo.insert(activity5);
  expect(res).toBe(true);
}

export async function update(repo: IActivityRepository){
  let res = await repo.update(activity3);
  expect(res).toBe(true);
  res = await repo.update(activity4);
  expect(res).toBe(true);
  res = await repo.update(activity6);
  expect(res).toBe(true);
}

export async function read(repo: IActivityRepository){
  let res = await repo.read(activity3.id);
  expect(omitTimestamps(activity3)).toEqual(omitTimestamps(res));
  res = await repo.read(activity4.id);
  expect(omitTimestamps(activity4)).toEqual(omitTimestamps(res));
  res = await repo.read(activity6.id);
  expect(omitTimestamps(activity6)).toEqual(omitTimestamps(res));
}

export async function list(repo: IActivityRepository){
  let res = await repo.list({fromDate:"2024-06-10", toDate: "2024-06-10"});
  if(res.length === 1){
    expect(omitTimestamps(activity3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`list1: ${res.length}`)
    expect.fail();
  }
  res = await repo.list({fromDate:"2024-06-01"});
  if(res.length === 3){
    for(const r of res){
      if(activity3.id === r.id){
        expect(omitTimestamps(activity3)).toEqual(omitTimestamps(r));
      }else if(activity4.id === r.id){
        expect(omitTimestamps(activity4)).toEqual(omitTimestamps(r));
      }else if(activity6.id === r.id){
        expect(omitTimestamps(activity6)).toEqual(omitTimestamps(r));
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`list2: ${res.length}`)
    expect.fail();
  }
}

export async function facilityList(repo: IActivityRepository){
  let res = await repo.list({facilityId: "0001"});
  if(res.length === 2){
    expect(omitTimestamps(activity3)).toEqual(omitTimestamps(res[0]));
    expect(omitTimestamps(activity6)).toEqual(omitTimestamps(res[1]));
  }else{
    console.log(`facility1: ${res.length}`)
    expect.fail();
  }
  res = await repo.list({facilityId: "0002"});
  if(res.length === 1){
    expect(omitTimestamps(activity4)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`facility2: ${res.length}`)
    expect.fail();
  }
}

export async function del(repo: IActivityRepository){
  await repo.delete(activity3);
  let res = await repo.read(activity3.id);
  expect(res).toBeUndefined();
  await repo.delete(activity4);
  res = await repo.read(activity4.id);
  expect(res).toBeUndefined();
  await repo.delete(activity6);
  res = await repo.read(activity6.id);
  expect(res).toBeUndefined();
}

export async function cleanUp(repoFac: IFacilityRepository, repoUser: IUserRepository){
  await repoFac.delete(facility);
  await repoFac.delete(facility2);
  await repoUser.delete(user);
}