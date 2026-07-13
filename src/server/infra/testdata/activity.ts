import { assert, assertFalse, fail } from "@std/assert"
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

function compare(val1: Activity, val2: Activity): boolean {
  if(val1.id !== val2.id){
    console.log(`id: ${val1.id} : ${val2.id}`)
    return false;
  }
  if(val1.date !== val2.date){
    console.log(`date: ${val1.date} : ${val2.date}`)
    return false;
  }
  if(val1.toDate !== val2.toDate){
    console.log(`toDate: ${val1.toDate} : ${val2.toDate}`)
    return false;
  }
  if(val1.participants !== val2.participants){
    console.log(`participants: ${val1.participants} : ${val2.participants}`)
    return false;
  }
  if(val1.facilityParticipants !== val2.facilityParticipants){
    console.log(`facilityParticipants: ${val1.facilityParticipants} : ${val2.facilityParticipants}`)
    return false;
  }
  if(val1.facility && val2.facility){
    const v1 = val1.facility;
    const v2 = val2.facility;
    if(v1.id !== v2.id){
      console.log(`facility_id: ${v1.id} : ${v2.id}`)
      return false;
    }
    if(v1.name !== v2.name){
      console.log(`facility_name: ${v1.name} : ${v2.name}`)
      return false;
    }
  }
  if(val1.purpose.length !== val2.purpose.length){
    console.log(`purpose: ${val1.purpose} : ${val2.purpose}`)
  }else{
    for(const p of val1.purpose){
      if(!val2.purpose.includes(p)){
        console.log(`purpose: ${p} : ${val2.purpose}`)
        return false;
      }
    }
  }
  return true;
}

export async function prepare(repoFac: IFacilityRepository, repoUser: IUserRepository){
  await repoFac.insert(facility);
  await repoFac.insert(facility2);
  await repoUser.insert(user);
}

export async function insert(repo: IActivityRepository){
  let res = await repo.insert(activity);
  assert(res);
  res = await repo.insert(activity2);
  assert(res);
  res = await repo.insert(activity5);
  assert(res);
}

export async function update(repo: IActivityRepository){
  let res = await repo.update(activity3);
  assert(res);
  res = await repo.update(activity4);
  assert(res);
  res = await repo.update(activity6);
  assert(res);
}

export async function read(repo: IActivityRepository){
  let res = await repo.read(activity3.id);
  if(res){
    assert(compare(activity3, res));
  }else{
    fail();
  }
  res = await repo.read(activity4.id);
  if(res){
    assert(compare(activity4, res));
  }else{
    fail();
  }
  res = await repo.read(activity6.id);
  if(res){
    assert(compare(activity6, res));
  }else{
    fail();
  }
}

export async function list(repo: IActivityRepository){
  let res = await repo.list({fromDate:"2024-06-10", toDate: "2024-06-10"});
  if(res.length === 1){
    assert(compare(activity3, res[0]));
  }else{
    console.log(`list1: ${res.length}`)
    fail();
  }
  res = await repo.list({fromDate:"2024-06-01"});
  if(res.length === 3){
    for(const r of res){
      if(activity3.id === r.id){
        assert(compare(activity3, r));
      }else if(activity4.id === r.id){
        assert(compare(activity4, r));
      }else if(activity6.id === r.id){
        assert(compare(activity6, r));
      }else{
        fail();
      }
    }
  }else{
    console.log(`list2: ${res.length}`)
    fail();
  }
}

export async function facilityList(repo: IActivityRepository){
  let res = await repo.list({facilityId: "0001"});
  if(res.length === 2){
    assert(compare(activity3, res[0]));
    assert(compare(activity6, res[1]));
  }else{
    console.log(`facility1: ${res.length}`)
    fail();
  }
  res = await repo.list({facilityId: "0002"});
  if(res.length === 1){
    assert(compare(activity4, res[0]));
  }else{
    console.log(`facility2: ${res.length}`)
    fail();
  }
}

export async function del(repo: IActivityRepository){
  await repo.delete(activity3);
  let res = await repo.read(activity3.id);
  assertFalse(res);
  await repo.delete(activity4);
  res = await repo.read(activity4.id);
  assertFalse(res);
  await repo.delete(activity6);
  res = await repo.read(activity6.id);
  assertFalse(res);
}

export async function cleanUp(repoFac: IFacilityRepository, repoUser: IUserRepository){
  await repoFac.delete(facility);
  await repoFac.delete(facility2);
  await repoUser.delete(user);
}