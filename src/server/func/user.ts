import { createServerFn } from "@tanstack/solid-start"
import { UserService } from "../domain/userService.ts"
import { UserRepository } from "../infra/allRepository.ts"
import type { AuthUser, User } from "../domain/user.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { toUser } from "../lib/types.ts"
import { info } from "./log.ts"

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
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {user: AuthUser}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new UserService(new UserRepository(auth.user.base));
      const res = await service.insert(data.user);
      if(res.ok){
        info({ data: { title: "insert User", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {user: AuthUser}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new UserService(new UserRepository(auth.user.base));
      const res = await service.update(data.user);
      if(res.ok){
        info({ data: { title: "update User", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {user: AuthUser}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new UserService(new UserRepository(auth.user.base));
      const res = await service.delete(data.user);
      if(res.ok){
        info({ data: { title: "delete User", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});