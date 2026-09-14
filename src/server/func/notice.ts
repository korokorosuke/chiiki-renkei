import { createServerFn } from "@tanstack/solid-start"
import { NoticeService } from "../domain/noticeService.ts"
import { NoticeRepository } from "../infra/allRepository.ts"
import type { Notice, NoticePage } from "../domain/notice.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { info } from "./log.ts"

const AUTH_READ = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAllNotices = createServerFn({ method: "GET" })
  .handler(async (): Promise<Notice[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      const service = new NoticeService(new NoticeRepository(auth.user.base));
      return await service.getAll();
    }else{
      return [];
    }
});

async function getList(base: string, page: NoticePage): Promise<Notice[]> {
  const service = new NoticeService(new NoticeRepository(base));
  if(base){
    return await service.getList(page);
  }else{
    return [];
  }
}

export const getLoginNotices = createServerFn({ method: "GET" })
  .validator((data : {base: string}) => data)
  .handler(async ({ data }): Promise<Notice[]> => {
    return await getList(data.base, "ログイン");
});

export const getMenuNotices = createServerFn({ method: "GET" })
  .handler(async (): Promise<Notice[]> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      return await getList(auth.user.base, "メニュー");
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {notice: Notice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const server = new NoticeService(new NoticeRepository(auth.user.base));
      const res = await server.insert(data.notice);
      if(res.ok){
        info({ data: { title: "insert Notice", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {notice: Notice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const server = new NoticeService(new NoticeRepository(auth.user.base));
      const res = await server.update(data.notice);
      if(res.ok){
        info({ data: { title: "update Notice", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {notice: Notice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const server = new NoticeService(new NoticeRepository(auth.user.base));
      const res = await server.delete(data.notice);
      if(res.ok){
        info({ data: { title: "delete Notice", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});