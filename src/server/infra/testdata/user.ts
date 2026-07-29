import { assert, assertFalse, fail } from "@std/assert"
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
}

function compare(u1: AuthUser, u2: AuthUser): boolean {
  if(u1.id !== u2.id){
    return false;
  }
  if(u1.name !== u2.name){
    return false;
  }
  if(u1.base !== u2.base){
    return false;
  }
  if(u1.authActivity !== u2.authActivity){
    return false;
  }
  if(u1.authFacility !== u2.authFacility){
    return false;
  }
  if(u1.authReferral !== u2.authReferral){
    return false;
  }
  if(u1.authMaster !== u2.authMaster){
    return false;
  }
  if(u1.authStatistics !== u2.authStatistics){
    return false;
  }
  return true;
}

export async function insert(repo: IUserRepository){
  let res = await repo.insert(user);
  assert(res);
  res = await repo.insert(user2);
  assert(res);
}
export async function update(repo: IUserRepository){
  const res = await repo.update(user3);
  assert(res);
}
export async function read(repo: IUserRepository){
  let res = await repo.read(user.id);
  if(res){
    assert(compare(user3, res));
  }else{
    fail();
  }
  res = await repo.read(user2.id);
  if(res){
    assert(compare(user2, res));
  }else{
    fail();
  }
}
export async function list(repo: IUserRepository){
  let res = await repo.list({name:"usagi"});
  if(res.length === 2){
    for(const r of res){
      if(r.id === user3.id){
        assert(compare(user3, r));
      }else if(r.id === user2.id){
        assert(compare(user2, r));
      }else{
        fail();
      }
    }
  }else{
    fail();
  }
  res = await repo.list({name:"usagi2"});
  if(res.length === 1){
    assert(compare(user2, res[0]));
  }else{
    fail();
  }
}
export async function del(repo: IUserRepository){
    await repo.delete(user);
    let res = await repo.read(user.id);
    assertFalse(res);
    await repo.delete(user2);
    res = await repo.read(user2.id);
    assertFalse(res);
}