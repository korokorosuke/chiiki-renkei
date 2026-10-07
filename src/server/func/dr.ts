import { createServerFn, createServerOnlyFn } from "@tanstack/solid-start"
import { redirect } from "@tanstack/solid-router"
import { DrService } from "../domain/drService.ts"
import { DrRepository } from "../infra/allRepository.ts"
import type { Dr } from "../domain/dr.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
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

const getDrsForDeptMain = createServerOnlyFn(async (dept: string): Promise<Dr[]> => {
  const auth = await authenticate(AUTH_READ);
  if(auth.ok){
    if(dept){
      const service = new DrService(new DrRepository(auth.user.base));
      return await service.getList(dept);
    }
    return [];
  }else{
    throw redirect({
      // @ts-ignore: なんかエラーになるため
      to: '/login'
    });
  }
});

export const getDrsForDept = createServerFn({ method: "GET" })
  .validator((data : {dept: string}) => data)
  .handler(async ({ data }): Promise<Dr[]> => {
    return await getDrsForDeptMain(data.dept);
});

export const getDrs = createServerFn({ method: "GET" })
  .validator((data : {dept: string}) => data)
  .handler(async ({ data }): Promise<Dr[]> => {
    return await getDrsForDeptMain(data.dept);
});

export const getAllDrs = createServerFn({ method: "GET" })
  .handler(async (): Promise<Dr[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new DrService(new DrRepository(auth.user.base));
      return await service.getAll();
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {dr: Dr}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new DrService(new DrRepository(auth.user.base));
        return await service.insert(data.dr);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {dr: Dr}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new DrService(new DrRepository(auth.user.base));
        return await service.update(data.dr);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {dr: Dr}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new DrService(new DrRepository(auth.user.base));
        return await service.delete(data.dr);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});