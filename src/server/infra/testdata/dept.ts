import { expect } from "vitest"
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

export async function insert(repo: IDepartmentRepository){
  let res = await repo.insert(department);
  expect(res).toBe(true);
  res = await repo.insert(department2);
  expect(res).toBe(true);
  res = await repo.insert(department4);
  expect(res).toBe(true);
}
export async function update(repo: IDepartmentRepository){
  const res = await repo.update(department3);
  expect(res).toBe(true);
}
export async function read(repo: IDepartmentRepository){
  let res = await repo.read(department.id);
  expect(department3).toEqual(res);
  res = await repo.read(department2.id);
  expect(department2).toEqual(res);
}
export async function exam(repo: IDepartmentRepository){
  const res = await repo.exam();
  if(res.length === 2){
    for(const r of res){
      if(r.id === department3.id) {
        expect(department3).toEqual(r);
      }else if(r.id === department2.id) {
        expect(department2).toEqual(r);
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`exam: ${res.length}`);
    expect.fail();
  }
}
export async function all(repo: IDepartmentRepository){
  const res = await repo.all();
  if(res.length === 3){
    for(const r of res){
      if(r.id === department3.id) {
        expect(department3).toEqual(r);
      }else if(r.id === department2.id) {
        expect(department2).toEqual(r);
      }else if(r.id === department4.id) {
        expect(department4).toEqual(r);
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`all: ${res.length}`);
    expect.fail();
  }
}
export async function del(repo: IDepartmentRepository){
  await repo.delete(department);
  let res = await repo.read(department.id);
  expect(res).toBeUndefined();
  await repo.delete(department2);
  res = await repo.read(department2.id);
  expect(res).toBeUndefined();
  await repo.delete(department4);
  res = await repo.read(department4.id);
  expect(res).toBeUndefined();
}