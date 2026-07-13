import { assert, assertFalse, fail } from "@std/assert"
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

function compare(u1: Staff, u2: Staff): boolean {
  if(u1.id !== u2.id){
    return false;
  }
  if(u1.name !== u2.name){
    return false;
  }
  if(u1.kana !== u2.kana){
    return false;
  }
  if(u1.department !== u2.department){
    return false;
  }
  if(u1.dr !== u2.dr){
    return false;
  }
  if(u1.facilityId !== u2.facilityId){
    return false;
  }
  if(u1.hidden !== u2.hidden){
    return false;
  }
  return true;
}

export async function insert(repo: IStaffRepository){
  let res = await repo.insert(staff);
  assert(res);
  res = await repo.insert(staff2);
  assert(res);
  res = await repo.insert(staff4);
  assert(res);
}
export async function update(repo: IStaffRepository){
  const res = await repo.update(staff3);
  assert(res);
}
export async function read(repo: IStaffRepository){
  let res = await repo.read(staff.id);
  if(res){
    assert(compare(staff3, res));
  }else{
    fail();
  }
  res = await repo.read(staff2.id);
  if(res){
    assert(compare(staff2, res));
  }else{
    fail();
  }
}
export async function list(repo: IStaffRepository){
  let res = await repo.list({facilityid: "00001", dr: false, hidden: true});
  if(res.length === 2){
    for(const r of res){
      if(staff3.id === r.id){
        assert(compare(staff3, r));
      }else if(staff2.id === r.id){
        assert(compare(staff2, r));
      }else{
        fail();
      }
    }
  }else{
    console.log(`list1: ${res.length}`);
    fail();
  }
  res = await repo.list({facilityid: "00001", dr: false, hidden: false});
  if(res.length === 1){
    assert(compare(staff3, res[0]));
  }else{
    console.log(`list2: ${res.length}`);
    fail();
  }
  res = await repo.list({facilityid: "00002", dr: true, hidden: true});
  if(res.length === 1){
    assert(compare(staff4, res[0]));
  }else{
    console.log(`list3: ${res.length}`);
    fail();
  }
}
export async function del(repo: IStaffRepository){
  await repo.delete(staff);
  let res = await repo.read(staff.id);
  assertFalse(res);
  await repo.delete(staff2);
  res = await repo.read(staff2.id);
  assertFalse(res);
  await repo.delete(staff4);
  res = await repo.read(staff4.id);
  assertFalse(res);
}