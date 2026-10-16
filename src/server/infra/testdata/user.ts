import { expect } from "vitest"
import type { IUserRepository } from "../../domain/userService.ts"
import type { AuthUser } from "../../domain/user.ts"
import { BASE } from "./settings.ts"
export { toUser } from "../../lib/types.ts"

export const user: AuthUser = {
  id: "user1",
  name: "usagi",
  department: "02",
  base: BASE,
  authFacility: 1,
  authReferral: 1,
  authActivity: 1,
  authMaster: 1,
  authStatistics: 1,
  authWeb: 1,
  authLog: 1,
  facilityId: "",
  password: "",
  locked: false,
  failCount: 0,
}
export const user2: AuthUser = {
  id: "user2",
  name: "usagi2",
  department: "01",
  base: BASE,
  authFacility: 1,
  authReferral: 1,
  authActivity: 1,
  authMaster: 1,
  authStatistics: 1,
  authWeb: 1,
  authLog: 1,
  facilityId: "",
  password: "",
  locked: false,
  failCount: 0,
}
export const user3: AuthUser = {
  id: "user1",
  name: "usagi",
  department: "01",
  base: BASE,
  authFacility: 2,
  authReferral: 2,
  authActivity: 2,
  authMaster: 2,
  authStatistics: 2,
  authWeb: 2,
  authLog: 2,
  facilityId: "",
  password: "",
  locked: false,
  failCount: 0,
}
export const user_inquiry: AuthUser = {
  id: "00001",
  name: "管理者ユーザー",
  department: "",
  base: BASE,
  authFacility: 2,
  authReferral: 2,
  authActivity: 2,
  authMaster: 2,
  authStatistics: 2,
  authWeb: 2,
  authLog: 2,
  facilityId: "",
  password: "",
  locked: false,
  failCount: 0,
}

export async function insert(repo: IUserRepository){
  let res = await repo.insert(user);
  expect(res).toBe(true);
  res = await repo.insert(user2);
  expect(res).toBe(true);
}
export async function update(repo: IUserRepository){
  const res = await repo.update(user3);
  expect(res).toBe(true);
}
export async function read(repo: IUserRepository){
  let res = await repo.read(user.id);
  expect(user3).toEqual(res);
  res = await repo.read(user2.id);
  expect(user2).toEqual(res);
}
export async function list(repo: IUserRepository){
  let res = await repo.list({name:"usagi"});
  if(res.length === 2){
    for(const r of res){
      if(r.id === user3.id){
        expect(user3).toEqual(r);
      }else if(r.id === user2.id){
        expect(user2).toEqual(r);
      }else{
        expect.fail();
      }
    }
  }else{
    expect.fail();
  }
  res = await repo.list({name:"usagi2"});
  if(res.length === 1){
    expect(user2).toEqual(res[0]);
  }else{
    expect.fail();
  }
}
export async function del(repo: IUserRepository){
    await repo.delete(user);
    let res = await repo.read(user.id);
    expect(res).toBeUndefined();
    await repo.delete(user2);
    res = await repo.read(user2.id);
    expect(res).toBeUndefined();
}