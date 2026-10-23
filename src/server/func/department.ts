import { createServerFn } from "@tanstack/solid-start"
import { DepartmentService } from "../domain/departmentService.ts"
import { DepartmentRepository } from "../infra/allRepository.ts"
import type { Department } from "../domain/department.ts"
import { authenticateOrRedirect, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

const AUTH_READ = [
  {auth: Auth.APPOINT, role: Role.READ},
  {auth: Auth.REFERRAL, role: Role.READ},
  {auth: Auth.STATISTICS, role: Role.READ},
];
const AUTH_READ_ALL = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getDepartments = createServerFn({ method: "GET" })
  .handler(async (): Promise<Department[]> => {
    const auth = await authenticateOrRedirect(AUTH_READ);
    const service = new DepartmentService(new DepartmentRepository(auth.user.base));
    return await service.getExam();
});

export const getAllDepartments = createServerFn({ method: "GET" })
  .handler(async (): Promise<Department[]> => {
    const auth = await authenticateOrRedirect(AUTH_READ_ALL);
    const service = new DepartmentService(new DepartmentRepository(auth.user.base));
    return await service.getAll();
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {department: Department}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const service = new DepartmentService(new DepartmentRepository(auth.user.base));
      return await service.insert(data.department);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {department: Department}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const service = new DepartmentService(new DepartmentRepository(auth.user.base));
      return await service.update(data.department);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {department: Department}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const service = new DepartmentService(new DepartmentRepository(auth.user.base));
      return await service.delete(data.department);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});