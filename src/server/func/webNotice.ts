import { createServerFn, createServerOnlyFn } from "@tanstack/solid-start"
import { WebNoticeService } from "../domain/webNoticeService.ts"
import { WebNoticeRepository } from "../infra/allRepository.ts"
import type { WebNotice, NoticePage } from "../domain/webNotice.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

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

const getList = createServerOnlyFn(async (base: string, page: NoticePage): Promise<WebNotice[]> => {
  const service = new WebNoticeService(new WebNoticeRepository(base));
  if(base){
    return await service.getList(page);
  }else{
    return [];
  }
});

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
  .middleware([LoggingMiddleware])
  .validator((data : {notice: WebNotice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new WebNoticeService(new WebNoticeRepository(auth.user.base));
        return await service.insert(data.notice);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {notice: WebNotice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new WebNoticeService(new WebNoticeRepository(auth.user.base));
        return await service.update(data.notice);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {notice: WebNotice}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new WebNoticeService(new WebNoticeRepository(auth.user.base));
        return await service.delete(data.notice);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }
    return ng(auth.errors!);
});