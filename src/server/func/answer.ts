import { createServerFn } from "@tanstack/solid-start"
import { redirect } from "@tanstack/solid-router"
import { AnswerPasswordService, AnswerService } from "../domain/answerService.ts"
import { QuestionnaireService } from "../domain/questionnaireService.ts"
import { AnswerRepository, AnswerPasswordRepository, QuestionnaireRepository } from "../infra/allRepository.ts"
import { type Answer, initialize } from "../domain/answer.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, type FetchResult, okWithData, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

const AUTH_READ = [
  {auth: Auth.APPOINT, role: Role.READ},
  {auth: Auth.REFERRAL, role: Role.READ},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_READ_ALL = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAnswers = createServerFn({ method: "GET" })
  .validator((data : {appId: string}) => data)
  .handler(async ({ data }): Promise<Answer[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new AnswerService(new AnswerRepository(auth.user.base),
        new AnswerPasswordRepository(auth.user.base));
      return await service.getList(data.appId);
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const getAnswersByPatient = createServerFn({ method: "GET" })
  .validator((data : {patientId: string}) => data)
  .handler(async ({ data }): Promise<Answer[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      const service = new AnswerService(new AnswerRepository(auth.user.base),
        new AnswerPasswordRepository(auth.user.base));
      return await service.getListByPatient(data.patientId);
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const exists = createServerFn({ method: "GET" })
  .validator((data : {appId: string, base: string}) => data)
  .handler(async ({ data }): Promise<boolean> => {
    const service = new AnswerService(new AnswerRepository(data.base),
      new AnswerPasswordRepository(data.base));
    const res = await service.getList(data.appId);
    return res.length > 0;
});

export const getPassword = createServerFn({ method: "GET" })
  .validator((data : {appId: string}) => data)
  .handler(async ({ data }): Promise<string> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      const service = new AnswerService(new AnswerRepository(auth.user.base),
        new AnswerPasswordRepository(auth.user.base));
      return await service.getPasswordService().getPassword(data.appId);
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const resetPassword = createServerFn({ method: "GET" })
  .middleware([LoggingMiddleware])
  .validator((data : {appId: string}) => data)
  .handler(async ({ data }): Promise<FetchResult<string>> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      try{
        const service = new AnswerService(new AnswerRepository(auth.user.base),
          new AnswerPasswordRepository(auth.user.base));
        return await service.getPasswordService().resetPassword(data.appId);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const getAnswersByPassword = createServerFn({ method: "GET" })
  .validator((data : {appId: string, password: string, base: string}) => data)
  .handler(async ({ data }): Promise<FetchResult<Answer[]>> => {
    const passService = new AnswerPasswordService(new AnswerPasswordRepository(data.base));
    const res = await passService.checkPassword(data.appId, data.password);
    if(res.ok){
      const service = new AnswerService(new AnswerRepository(data.base),
        new AnswerPasswordRepository(data.base));
      const answers = await service.getList(data.appId);
      return okWithData(answers);
    }else{
      return res;
    }
});

export const getAnswer = createServerFn({ method: "POST" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Answer|undefined> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.id){
        const service = new AnswerService(new AnswerRepository(auth.user.base),
          new AnswerPasswordRepository(auth.user.base));
        return await service.get(data.id);
      }
      return undefined;
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const create = createServerFn({ method: "POST" })
  .validator((data : {qid: string, appId: string}) => data)
  .handler(async ({ data }): Promise<Answer> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new QuestionnaireService(new QuestionnaireRepository(auth.user.base));
      const q = await service.get(data.qid);
      if(q){
        const aitems = q.items.map(()=>"");
        return {
          id: "",
          questionnaire: q,
          appointmentId: data.appId,
          items: aitems,
        };
      }
      return initialize();
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {answer: Answer}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new AnswerService(new AnswerRepository(auth.user.base),
          new AnswerPasswordRepository(auth.user.base));
        return await service.insert(data.answer);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {answer: Answer, base: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    let auth;
    if(!data.base){
      auth = await authenticate(AUTH_WRITE);
      if(auth.ok){
        data.base = auth.user.base;
      }else{
        throw redirect({
          // @ts-ignore: なんかエラーになるため
          to: '/login'
        });
      }
    }
    if(data.base){
      try{
        const service = new AnswerService(new AnswerRepository(data.base),
          new AnswerPasswordRepository(data.base));
        return await service.update(data.answer);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, data.base, auth ? auth.user.id : undefined, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }
    return ng(["登録に失敗しました。"]);
});

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {answer: Answer}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const service = new AnswerService(new AnswerRepository(auth.user.base),
          new AnswerPasswordRepository(auth.user.base));
        return await service.delete(data.answer);
      }catch(e){
        if(e instanceof FatalError){
          await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
        }
        return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});