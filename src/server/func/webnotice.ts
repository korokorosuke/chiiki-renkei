import { createServerFn } from "@tanstack/solid-start"
import { WebNoticeService } from "../domain/webNoticeService.ts"
import { WebNoticeRepository } from "../infra/allRepository.ts"
import type { WebNotice } from "../domain/webNotice.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

const AUTH_READ = {auth: Auth.WEB, role: Role.READ};
const AUTH_READ_ALL = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAllNotices = createServerFn({ method: "GET" })
  .handler(async (): Promise<WebNotice[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      return await get(auth.user!.base, true);
    }else{
      return [];
    }
});

export const getNotices = createServerFn({ method: "GET" })
  .handler(async (): Promise<WebNotice[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      return await get(auth.user!.base, false);
    }else{
      return [];
    }
});

async function get(base: string, all: boolean): Promise<WebNotice[]> {
  const service = new WebNoticeService(new WebNoticeRepository(base));
  let res: WebNotice[];
  if(all){
    res = await service.getAll();
  }else{
    res = await service.getList();
  }
  if(res.length > 1){
    res.sort((v1,v2)=>{
      if(v1.fromDate > v2.fromDate){
        return -1;
      }else if(v1.fromDate < v2.fromDate){
        return 1;
      }else{
        return 0;
      }
    });
  }
  return res;
}

export const insert = createServerFn({ method: "POST" })
  .validator((data : {notice: WebNotice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebNoticeService(new WebNoticeRepository(auth.user!.base));
      return await service.insert(data.notice);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {notice: WebNotice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebNoticeService(new WebNoticeRepository(auth.user!.base));
      return await service.update(data.notice);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {notice: WebNotice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebNoticeService(new WebNoticeRepository(auth.user!.base));
      await service.delete(data.notice);
      return ok();
    }
    return ng(auth.errors!);
});