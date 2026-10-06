import { createServerFn } from "@tanstack/solid-start"
import { redirect } from "@tanstack/solid-router"
import { UserService } from "../domain/userService.ts"
import { UserRepository } from "../infra/allRepository.ts"
import type { AuthUser, User } from "../domain/user.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { toUser } from "../lib/types.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

const AUTH_READ = [
  {auth: Auth.APPOINT, role: Role.READ},
  {auth: Auth.REFERRAL, role: Role.READ},
  {auth: Auth.FACILITY, role: Role.READ},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAuthUser = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<AuthUser | undefined> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.id){
        const service = new UserService(new UserRepository(auth.user.base));
        return await service.get(data.id);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
    return undefined;
});

export const getUser = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<User | undefined> => {
    const user = await getAuthUser({data: {id: data.id}});
    if(user){
      return toUser(user);
    }
    return undefined;
});

export const getUsers = createServerFn({ method: "GET" })
  .validator((data : {name: string}) => data)
  .handler(async ({ data }): Promise<AuthUser[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.name){
        const service = new UserService(new UserRepository(auth.user.base));
        return await service.getList(data.name);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {user: AuthUser}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new UserService(new UserRepository(auth.user.base));
        return await service.insert(data.user);
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
  .validator((data : {user: AuthUser}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new UserService(new UserRepository(auth.user.base));
        return await service.update(data.user);
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
  .validator((data : {user: AuthUser}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new UserService(new UserRepository(auth.user.base));
        return await service.delete(data.user);
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