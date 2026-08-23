import { createServerFn } from "@tanstack/solid-start"
import { NoticeService } from "../domain/noticeService.ts"
import { NoticeRepository } from "../infra/allRepository.ts"
import type { Notice } from "../domain/notice.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"

const AUTH_READ = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAllNotices = createServerFn({ method: "GET" })
  .handler(async (): Promise<Notice[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      return await get(auth.user!.base, true);
    }else{
      return [];
    }
});

export const getNotices = createServerFn({ method: "GET" })
  .validator((data : {base: string}) => data)
  .handler(async ({ data }): Promise<Notice[]> => {
    if(data.base){
      return await get(data.base, false);
    }else{
      return [];
    }
});

async function get(base: string, all: boolean): Promise<Notice[]> {
  const service = new NoticeService(new NoticeRepository(base));
  let res: Notice[];
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
  .validator((data : {notice: Notice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const server = new NoticeService(new NoticeRepository(auth.user!.base));
      return await server.insert(data.notice);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {notice: Notice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const server = new NoticeService(new NoticeRepository(auth.user!.base));
      return await server.update(data.notice);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {notice: Notice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const server = new NoticeService(new NoticeRepository(auth.user!.base));
      return await server.delete(data.notice);
    }
    return ng(auth.errors!);
});