import { createServerFn } from "@tanstack/solid-start"
import { DepartmentService } from "../domain/departmentService.ts"
import { DepartmentRepository } from "../infra/allRepository.ts"
import type { Department } from "../domain/department.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

const AUTH_READ = [
  {auth: Auth.APPOINT, role: Role.READ},
  {auth: Auth.REFERRAL, role: Role.READ},
  {auth: Auth.STATISTICS, role: Role.READ},
];
const AUTH_READ_ALL = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getDepartments = createServerFn({ method: "GET" })
  .handler(async (): Promise<Department[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      const service = new DepartmentService(new DepartmentRepository(auth.user!.base));
      return await service.getExam();
    }
    return [];
});

export const getAllDepartments = createServerFn({ method: "GET" })
  .handler(async (): Promise<Department[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new DepartmentService(new DepartmentRepository(auth.user!.base));
      return await service.getAll();
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {department: Department}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new DepartmentService(new DepartmentRepository(auth.user!.base));
      return await service.insert(data.department);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {department: Department}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new DepartmentService(new DepartmentRepository(auth.user!.base));
      return await service.update(data.department);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {department: Department}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.department){
        const service = new DepartmentService(new DepartmentRepository(auth.user!.base));
        await service.delete(data.department);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});