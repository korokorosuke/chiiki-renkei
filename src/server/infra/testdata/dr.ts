import { assert, assertFalse, fail } from "@std/assert"
import type { IDrRepository } from "../../domain/drService.ts"
import type { Dr } from "../../domain/dr.ts"

export const dr: Dr = {
  id: "00001",
  name: "山田　太郎",
  department: "01",
}
export const dr2: Dr = {
  id: "00002",
  name: "山田　次郎",
  department: "02",
}
export const dr3: Dr = {
  id: "00001",
  name: "山田　太郎",
  department: "01",
}
export const dr4: Dr = {
  id: "00003",
  name: "山田　三郎",
  department: "02",
}

function compare(u1: Dr, u2: Dr): boolean {
  if(u1.id !== u2.id){
    return false;
  }
  if(u1.name !== u2.name){
    return false;
  }
  if(u1.department !== u2.department){
    return false;
  }
  return true;
}

export async function insert(repo: IDrRepository){
  let res = await repo.insert(dr);
  assert(res);
  res = await repo.insert(dr2);
  assert(res);
  res = await repo.insert(dr4);
  assert(res);
}
export async function update(repo: IDrRepository){
  const res = await repo.update(dr3);
  assert(res);
}
export async function read(repo: IDrRepository){
  let res = await repo.read(dr.id);
  if(res){
    assert(compare(dr3, res));
  }else{
    fail();
  }
  res = await repo.read(dr2.id);
  if(res){
    assert(compare(dr2, res));
  }else{
    fail();
  }
}
export async function list(repo: IDrRepository){
  let res = await repo.list("02");
  if(res.length === 2){
    assert(compare(dr2, res[0]));
    assert(compare(dr4, res[1]));
  }else{
    console.log(`list1: ${res.length}`);
    fail();
  }
  res = await repo.list("01");
  if(res.length === 1){
    assert(compare(dr3, res[0]));
  }else{
    console.log(`list2: ${res.length}`);
    fail();
  }
}
export async function del(repo: IDrRepository){
  await repo.delete(dr3);
  let res = await repo.read(dr.id);
  assertFalse(res);
  await repo.delete(dr2);
  res = await repo.read(dr2.id);
  assertFalse(res);
  await repo.delete(dr4);
  res = await repo.read(dr4.id);
  assertFalse(res);
}