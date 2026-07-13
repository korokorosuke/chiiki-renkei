import { createServerFn } from "@tanstack/solid-start"
import { AnswerPasswordService, AnswerService } from "../domain/answerService.ts"
import { QuestionnaireService } from "../domain/questionnaireService.ts"
import { AnswerRepository, AnswerPasswordRepository, QuestionnaireRepository } from "../infra/allRepository.ts"
import { type Answer, initialize } from "../domain/answer.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, type FetchResult, ok, ng } from "../lib/response.ts"

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
      const service = new AnswerService(new AnswerRepository(auth.user!.base),
        new AnswerPasswordRepository(auth.user!.base));
      return await service.getList(data.appId);
    }
    return [];
});

export const getAnswersByPatient = createServerFn({ method: "GET" })
  .validator((data : {patientId: string}) => data)
  .handler(async ({ data }): Promise<Answer[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      const service = new AnswerService(new AnswerRepository(auth.user!.base),
        new AnswerPasswordRepository(auth.user!.base));
      return await service.getListByPatient(data.patientId);
    }
    return [];
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
      const service = new AnswerService(new AnswerRepository(auth.user!.base),
        new AnswerPasswordRepository(auth.user!.base));
      return await service.getPasswordService().getPassword(data.appId);
    }
    return "";
});

export const resetPassword = createServerFn({ method: "GET" })
  .validator((data : {appId: string}) => data)
  .handler(async ({ data }): Promise<FetchResult<string>> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      const service = new AnswerService(new AnswerRepository(auth.user!.base),
        new AnswerPasswordRepository(auth.user!.base));
      return await service.getPasswordService().resetPassword(data.appId);
    }
    return ng(["パスワードのリセットに失敗しました。"]);
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
      return ok(answers);
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
        const service = new AnswerService(new AnswerRepository(auth.user!.base),
          new AnswerPasswordRepository(auth.user!.base));
        return await service.get(data.id);
      }
    }
    return undefined;
});

export const create = createServerFn({ method: "POST" })
  .validator((data : {qid: string, appId: string}) => data)
  .handler(async ({ data }): Promise<Answer> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new QuestionnaireService(new QuestionnaireRepository(auth.user!.base));
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
    }
    return {} as Answer;
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {answer: Answer}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new AnswerService(new AnswerRepository(auth.user!.base),
        new AnswerPasswordRepository(auth.user!.base));
      return await service.insert(data.answer);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {answer: Answer, base: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    let auth;
    if(!data.base){
      auth = await authenticate(AUTH_WRITE);
      if(auth.ok){
        data.base = auth.user!.base;
      }else{
        return ng(auth.errors!);
      }
    }
    if(data.base){
      const service = new AnswerService(new AnswerRepository(data.base),
        new AnswerPasswordRepository(data.base));
      return await service.update(data.answer);
    }
    return ng(["登録に失敗しました。"]);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {answer: Answer}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.answer){
        const service = new AnswerService(new AnswerRepository(auth.user!.base),
          new AnswerPasswordRepository(auth.user!.base));
        await service.delete(data.answer);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});