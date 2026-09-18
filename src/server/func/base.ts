import { createServerFn } from "@tanstack/solid-start"
import { BaseService } from "../domain/baseService.ts"
import { BaseRepository } from "../infra/allRepository.ts"
import type { Base } from "../domain/base.ts"
import { getBase as getSession, setBase } from '../lib/session.ts'
import { type Result, ng } from "../lib/response.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"

const AUTH_WRITE =  {auth: Auth.MASTER, role: Role.READ};

export const getBase = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Base|undefined> => {
    if(data.id){
      const service = new BaseService(new BaseRepository());
      return await service.get(data.id);
    }
    return undefined;
});

export const getSessionBase = createServerFn({ method: "GET" })
  .handler(async (): Promise<Base|undefined> => {
    return await getSession();
});

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data: { base: Base }) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new BaseService(new BaseRepository());
      const res = await service.update(data.base);
      if(res.ok){
        await setBase(data.base);
      }
      return res;
    }
    return ng(auth.errors!);
});