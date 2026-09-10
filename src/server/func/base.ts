import { createServerFn } from "@tanstack/solid-start"
import { BaseService } from "../domain/baseService.ts"
import { BaseRepository } from "../infra/allRepository.ts"
import type { Base } from "../domain/base.ts"
import { getBase as getSession } from '../lib/session.ts'

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