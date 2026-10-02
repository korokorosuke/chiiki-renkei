import { createServerFn } from "@tanstack/solid-start"
import { WebDepartmentService } from "../domain/webDepartmentService.ts"
import { WebDepartmentRepository } from "../infra/allRepository.ts"
import type { WebDepartment } from "../domain/webDepartment.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

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
        const service = new WebDepartmentService(new WebDepartmentRepository(auth.user.base));
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
      const service = new WebDepartmentService(new WebDepartmentRepository(auth.user.base));
      return await service.getAll();
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {department: WebDepartment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new WebDepartmentService(new WebDepartmentRepository(auth.user.base));
        return await service.insert(data.department);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {department: WebDepartment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new WebDepartmentService(new WebDepartmentRepository(auth.user.base));
        return await service.update(data.department);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {department: WebDepartment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new WebDepartmentService(new WebDepartmentRepository(auth.user.base));
        return await service.delete(data.department);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }
    return ng(auth.errors!);
});