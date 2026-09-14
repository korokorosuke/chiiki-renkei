import { createServerFn } from "@tanstack/solid-start"
import { DueService } from "../domain/dueService.ts"
import { DueRepository } from "../infra/allRepository.ts"
import type { Due } from "../domain/due.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { info } from "./log.ts"

const AUTH_READ_ALL = [
  {auth: Auth.APPOINT, role: Role.READ},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAllDues = createServerFn({ method: "GET" })
  .handler(async (): Promise<Due[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new DueService(new DueRepository(auth.user.base));
      return await service.getAll();
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {due: Due}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new DueService(new DueRepository(auth.user.base));
      const res = await service.insert(data.due);
      if(res.ok){
        info({ data: { title: "insert Due", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {due: Due}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new DueService(new DueRepository(auth.user.base));
      const res = await service.update(data.due);
      if(res.ok){
        info({ data: { title: "update Due", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
})

export const del = createServerFn({ method: "POST" })
  .validator((data : {due: Due}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new DueService(new DueRepository(auth.user.base));
      const res = await service.delete(data.due);
      if(res.ok){
        info({ data: { title: "delete Due", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});