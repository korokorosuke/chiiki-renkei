import { assert, assertFalse, fail } from "@std/assert"
import type { IWebDepartmentRepository } from "../../domain/webDepartmentService.ts"
import type { WebDepartment } from "../../domain/webDepartment.ts"

export const department: WebDepartment = {
  id: "01",
  name: "内科",
  description: "",
}
export const department2: WebDepartment = {
  id: "02",
  name: "外科",
  description: "",
}
export const department3: WebDepartment = {
  id: "01",
  name: "内科",
  description: "更新後",
}

function compare(u1: WebDepartment, u2: WebDepartment): boolean {
  if(u1.id !== u2.id){
    return false;
  }
  if(u1.name !== u2.name){
    return false;
  }
  if(u1.description !== u2.description){
    return false;
  }
  return true;
}

export async function insert(repo: IWebDepartmentRepository){
  let res = await repo.insert(department);
  assert(res);
  res = await repo.insert(department2);
  assert(res);
}
export async function update(repo: IWebDepartmentRepository){
  const res = await repo.update(department3);
  assert(res);
}
export async function read(repo: IWebDepartmentRepository){
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
export async function all(repo: IWebDepartmentRepository){
  const res = await repo.all();
  if(res.length === 2){
    for(const r of res){
      if(r.id === department3.id){
        assert(compare(department3, r));
      }else if(r.id === department2.id){
        assert(compare(department2, r));
      }else{
        fail();
      }
    }
  }else{
    console.log(`all: ${res.length}`)
    fail();
  }
}
export async function del(repo: IWebDepartmentRepository){
  await repo.delete(department);
  let res = await repo.read(department.id);
  assertFalse(res);
  await repo.delete(department2);
  res = await repo.read(department2.id);
  assertFalse(res);
}