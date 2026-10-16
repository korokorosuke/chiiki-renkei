import { expect } from "vitest"
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

export async function insert(repo: IWebDepartmentRepository){
  let res = await repo.insert(department);
  expect(res).toBe(true);
  res = await repo.insert(department2);
  expect(res).toBe(true);
}
export async function update(repo: IWebDepartmentRepository){
  const res = await repo.update(department3);
  expect(res).toBe(true);
}
export async function read(repo: IWebDepartmentRepository){
  let res = await repo.read(department.id);
  expect(department3).toEqual(res);
  res = await repo.read(department2.id);
  expect(department2).toEqual(res);
}
export async function all(repo: IWebDepartmentRepository){
  const res = await repo.all();
  if(res.length === 2){
    for(const r of res){
      if(r.id === department3.id){
        expect(department3).toEqual(r);
      }else if(r.id === department2.id){
        expect(department2).toEqual(r);
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`all: ${res.length}`)
    expect.fail();
  }
}
export async function del(repo: IWebDepartmentRepository){
  await repo.delete(department);
  let res = await repo.read(department.id);
  expect(res).toBeUndefined();
  await repo.delete(department2);
  res = await repo.read(department2.id);
  expect(res).toBeUndefined();
}