import { createServerFn } from "@tanstack/solid-start"
import { WebNoticeService } from "../domain/webNoticeService.ts"
import { WebNoticeRepository } from "../infra/allRepository.ts"
import type { WebNotice, NoticePage } from "../domain/webNotice.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { info } from "./log.ts"

const AUTH_READ = {auth: Auth.WEB, role: Role.READ};
const AUTH_READ_ALL = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAllNotices = createServerFn({ method: "GET" })
  .handler(async (): Promise<WebNotice[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new WebNoticeService(new WebNoticeRepository(auth.user.base));
      return await service.getAll();
    }else{
      return [];
    }
});

async function getList(base: string, page: NoticePage): Promise<WebNotice[]> {
  const service = new WebNoticeService(new WebNoticeRepository(base));
  if(base){
    return await service.getList(page);
  }else{
    return [];
  }
}

export const getNotices = createServerFn({ method: "GET" })
  .handler(async (): Promise<WebNotice[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      return await getList(auth.user.base, "メニュー");
    }else{
      return [];
    }
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {notice: WebNotice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebNoticeService(new WebNoticeRepository(auth.user.base));
      const res = await service.insert(data.notice);
      if(res.ok){
        info({ data: { title: "insert WebNotice", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {notice: WebNotice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebNoticeService(new WebNoticeRepository(auth.user.base));
      const res = await service.update(data.notice);
      if(res.ok){
        info({ data: { title: "update WebNotice", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {notice: WebNotice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebNoticeService(new WebNoticeRepository(auth.user.base));
      const res =  await service.delete(data.notice);
      if(res.ok){
        info({ data: { title: "delete WebNotice", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});