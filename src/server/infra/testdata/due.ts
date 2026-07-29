import { assert, assertFalse, fail } from "@std/assert"
import type { IDueRepository } from "../../domain/dueService.ts"
import type { Due } from "../../domain/due.ts"

export const due: Due = {
  id: 1,
  name: "当日",
  days: 0
}
export const due2: Due = {
  id: 2,
  name: "翌日",
  days: 1
}
export const due3: Due = {
  id: 1,
  name: "本日",
  days: 0
}
export const due4: Due = {
  id: 3,
  name: "翌日",
  days: -1
}

function compare(u1: Due, u2: Due): boolean {
  if(u1.id !== u2.id){
    return false;
  }
  if(u1.name !== u2.name){
    return false;
  }
  if(u1.days !== u2.days){
    return false;
  }
  return true;
}

export async function insert(repo: IDueRepository){
  let res = await repo.insert(due);
  assert(res);
  res = await repo.insert(due2);
  assert(res);
  res = await repo.insert(due4);
  assert(res);
}
export async function update(repo: IDueRepository){
  const res = await repo.update(due3);
  assert(res);
}
export async function read(repo: IDueRepository){
  let res = await repo.read(due.id);
  if(res){
    assert(compare(due3, res));
  }else{
    fail();
  }
  res = await repo.read(due2.id);
  if(res){
    assert(compare(due2, res));
  }else{
    fail();
  }
}
export async function all(repo: IDueRepository){
  const res = await repo.all();
  if(res.length === 3){
    for(const r of res){
      if(r.id === due3.id){
        assert(compare(due3, r));
      }else if(r.id === due2.id){
        assert(compare(due2, r));
      }else if(r.id === due4.id){
        assert(compare(due4, r));
      }else{
        fail();
      }
    }
  }else{
    console.log(`list2: ${res.length}`);
    fail();
  }
}
export async function del(repo: IDueRepository){
  await repo.delete(due);
  let res = await repo.read(due3.id);
  assertFalse(res);
  await repo.delete(due2);
  res = await repo.read(due2.id);
  assertFalse(res);
  await repo.delete(due4);
  res = await repo.read(due4.id);
  assertFalse(res);
}