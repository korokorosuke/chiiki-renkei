import { createServerFn } from "@tanstack/solid-start"
import { DueService } from "../domain/dueService.ts"
import { DueRepository } from "../infra/allRepository.ts"
import type { Due } from "../domain/due.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

const AUTH_READ_ALL = [
  {auth: Auth.APPOINT, role: Role.READ},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAllDues = createServerFn({ method: "GET" })
  .handler(async (): Promise<Due[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new DueService(new DueRepository(auth.user!.base));
      return await service.getAll();
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {due: Due}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new DueService(new DueRepository(auth.user!.base));
      return await service.insert(data.due);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {due: Due}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new DueService(new DueRepository(auth.user!.base));
      return await service.update(data.due);
    }
    return ng(auth.errors!);
})

export const del = createServerFn({ method: "POST" })
  .validator((data : {due: Due}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.due){
        const service = new DueService(new DueRepository(auth.user!.base));
        await service.delete(data.due);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});