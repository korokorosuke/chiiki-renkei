import { createServerFn } from "@tanstack/solid-start"
import { ReplyService, ReplyListService } from "../domain/replyService.ts"
import { ReplyRepository } from "../infra/allRepository.ts"
import type { Reply } from "../domain/reply.ts"
import type { Referral } from "../domain/referral.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

const AUTH_READ = {auth: Auth.REFERRAL, role: Role.READ};
const AUTH_WRITE = {auth: Auth.REFERRAL, role: Role.WRITE};

export const getReply = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Referral|undefined> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.id){
        const service = new ReplyListService(
          new ReplyRepository(auth.user!.base));
        return await service.get(data.id);
      }
    }
    return undefined;
});

export const getReplies = createServerFn({ method: "GET" })
  .validator((data : {patientId: string}) => data)
  .handler(async ({ data }): Promise<Referral[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.patientId){
        const service = new ReplyListService(
          new ReplyRepository(auth.user!.base));
        return await service.getListByPatient(data.patientId);
      }
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {reply: Reply}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ReplyService(new ReplyRepository(auth.user!.base));
      return await service.insert(data.reply);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {reply: Reply}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ReplyService(new ReplyRepository(auth.user!.base));
      return await service.update(data.reply);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {reply: Reply}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.reply){
        const service = new ReplyService(new ReplyRepository(auth.user!.base));
        await service.delete(data.reply);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});