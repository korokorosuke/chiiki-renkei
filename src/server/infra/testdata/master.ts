import { assert, fail } from "@std/assert"
import type { IMasterRepository } from "../../domain/masterService.ts"

const data = ["あああ","いいい","ううう"];
const data2 = ["あああ","いいい","うううう"];
const data3 = ["あああ","いいい","うううう","えええ"];

function compare(d1: string[], d2: string[]): boolean {
  if(d1.length !== d2.length){
    return false;
  }
  for(let i = 0; i < d1.length; i++){
    if(d1[i] !== d2[i]){
      return false;
    }
  }
  return true;
}

export async function prepare(repo: IMasterRepository){
  const res = await repo.update("kind", data);
  assert(res);
}
export async function update(repo: IMasterRepository){
  let res = await repo.update("kind", data2);
  assert(res);
  res = await repo.update("kind", data3);
  assert(res);
}
export async function read(repo: IMasterRepository){
  const res = await repo.read("kind");
  if(res){
    assert(compare(data3, res));
  }else{
    fail();
  }
}