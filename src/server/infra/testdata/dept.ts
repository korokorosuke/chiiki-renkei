import { assert, assertFalse, fail } from "@std/assert"
import type { IDepartmentRepository } from "../../domain/departmentService.ts"
import type { Department } from "../../domain/department.ts"

export const department: Department = {
  id: "01",
  name: "内科",
  exam: true,
}
export const department2: Department = {
  id: "02",
  name: "外科",
  exam: true,
}
export const department3: Department = {
  id: "01",
  name: "一般内科",
  exam: true,
}
export const department4: Department = {
  id: "50",
  name: "地域医療連携室",
  exam: false,
}

function compare(u1: Department, u2: Department): boolean {
  if(u1.id !== u2.id){
    return false;
  }
  if(u1.name !== u2.name){
    return false;
  }
  return true;
}

export async function insert(repo: IDepartmentRepository){
  let res = await repo.insert(department);
  assert(res);
  res = await repo.insert(department2);
  assert(res);
  res = await repo.insert(department4);
  assert(res);
}
export async function update(repo: IDepartmentRepository){
  const res = await repo.update(department3);
  assert(res);
}
export async function read(repo: IDepartmentRepository){
  let res = await repo.read(department.id);
  if(res){
    assert(compare(department3, res));
  }else{
    fail();
  }
  res = await repo.read(department2.id);
  if(res){
    assert(compare(department2, res));
  }else{
    fail();
  }
}
export async function exam(repo: IDepartmentRepository){
  const res = await repo.exam();
  if(res.length === 2){
    assert(compare(department3, res[0]));
    assert(compare(department2, res[1]));
  }else{
    console.log(`exam: ${res.length}`);
    fail();
  }
}
export async function all(repo: IDepartmentRepository){
  const res = await repo.all();
  if(res.length === 3){
    assert(compare(department3, res[0]));
    assert(compare(department2, res[1]));
    assert(compare(department4, res[2]));
  }else{
    console.log(`all: ${res.length}`);
    fail();
  }
}
export async function del(repo: IDepartmentRepository){
  await repo.delete(department);
  let res = await repo.read(department.id);
  assertFalse(res);
  await repo.delete(department2);
  res = await repo.read(department2.id);
  assertFalse(res);
  await repo.delete(department4);
  res = await repo.read(department4.id);
  assertFalse(res);
}