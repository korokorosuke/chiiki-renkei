import { createServerFn } from "@tanstack/solid-start"
import { WebDrService } from "../domain/webDrService.ts"
import { WebDrRepository } from "../infra/allRepository.ts"
import type { WebDr } from "../domain/webDr.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { info } from "./log.ts"

const AUTH_READ = [
  {auth: Auth.WEB, role: Role.READ},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_READ_ALL = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getWebDrs = createServerFn({ method: "GET" })
  .validator((data : {dept: string}) => data)
  .handler(async ({ data }): Promise<WebDr[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.dept){
        const service = new WebDrService(new WebDrRepository(auth.user.base));
        return await service.getList(data.dept);
      }
    }
    return [];
});

export const getAllWebDrs = createServerFn({ method: "GET" })
  .handler(async (): Promise<WebDr[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new WebDrService(new WebDrRepository(auth.user.base));
      return await service.getAll();
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {dr: WebDr}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebDrService(new WebDrRepository(auth.user.base));
      const res = await service.insert(data.dr);
      if(res.ok){
        info({ data: { title: "insert WebDr", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {dr: WebDr}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebDrService(new WebDrRepository(auth.user.base));
      const res = await service.update(data.dr);
      if(res.ok){
        info({ data: { title: "update WebDr", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {dr: WebDr}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebDrService(new WebDrRepository(auth.user.base));
      const res = await service.delete(data.dr);
      if(res.ok){
        info({ data: { title: "delete WebDr", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});