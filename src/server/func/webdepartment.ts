import { createServerFn } from "@tanstack/solid-start"
import { WebDepartmentService } from "../domain/webDepartmentService.ts"
import { WebDepartmentRepository } from "../infra/allRepository.ts"
import type { WebDepartment } from "../domain/webDepartment.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"

const AUTH_READ = [
  {auth: Auth.WEB, role: Role.READ},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_READ_ALL = [
  {auth: Auth.MASTER, role: Role.READ},
  {auth: Auth.WEB, role: Role.READ}
];
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const get = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<WebDepartment | undefined> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.id){
        const service = new WebDepartmentService(new WebDepartmentRepository(auth.user!.base));
        return await service.get(data.id);
      }
    }else{
      return undefined;
    }
});

export const getWebDepartments = createServerFn({ method: "GET" })
  .handler(async (): Promise<WebDepartment[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new WebDepartmentService(new WebDepartmentRepository(auth.user!.base));
      return await service.getAll();
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {department: WebDepartment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebDepartmentService(new WebDepartmentRepository(auth.user!.base));
      return await service.insert(data.department);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {department: WebDepartment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebDepartmentService(new WebDepartmentRepository(auth.user!.base));
      return await service.update(data.department);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {department: WebDepartment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebDepartmentService(new WebDepartmentRepository(auth.user!.base));
      return await service.delete(data.department);
    }
    return ng(auth.errors!);
});