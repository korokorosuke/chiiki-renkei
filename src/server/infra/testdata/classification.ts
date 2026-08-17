import { assert, assertFalse, fail } from "@std/assert"
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

function compare(u1: Classification, u2: Classification): boolean {
  if(u1.id !== u2.id){
    return false;
  }
  if(u1.name !== u2.name){
    return false;
  }
  return true;
}

export async function insert(repo: IClassificationRepository){
  let res = await repo.insert(classification1);
  assert(res);
  res = await repo.insert(classification2);
  assert(res);
  res = await repo.insert(classification4);
  assert(res);
}
export async function update(repo: IClassificationRepository){
  const res = await repo.update(classification3);
  assert(res);
}
export async function read(repo: IClassificationRepository){
  let res = await repo.read(classification1.id);
  if(res){
    assert(compare(classification3, res));
  }else{
    fail();
  }
  res = await repo.read(classification2.id);
  if(res){
    assert(compare(classification2, res));
  }else{
    fail();
  }
}
export async function all(repo: IClassificationRepository){
  const res = await repo.all();
  if(res.length === 3){
    for(const r of res){
      if(r.id === classification3.id) {
        assert(compare(classification3, r));
      }else if(r.id === classification2.id) {
        assert(compare(classification2, r));
      }else if(r.id === classification4.id) {
        assert(compare(classification4, r));
      }else{
        fail();
      }
    }
  }else{
    console.log(`all: ${res.length}`);
    fail();
  }
}
export async function del(repo: IClassificationRepository){
  await repo.delete(classification1);
  let res = await repo.read(classification1.id);
  assertFalse(res);
  await repo.delete(classification2);
  res = await repo.read(classification2.id);
  assertFalse(res);
  await repo.delete(classification4);
  res = await repo.read(classification4.id);
  assertFalse(res);
}