import { createServerFn } from "@tanstack/solid-start"
import { QuestionnaireService } from "../domain/questionnaireService.ts"
import { QuestionnaireRepository } from "../infra/allRepository.ts"
import type { Questionnaire } from "../domain/questionnaire.ts"
import { authenticateOrRedirect, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

const AUTH_READ = [
  {auth: Auth.ACTIVITY, role: Role.READ},
  {auth: Auth.REFERRAL, role: Role.READ},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_READ_ALL = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getQuestionnaires = createServerFn({ method: "GET" })
  .handler(async (): Promise<Questionnaire[]> => {
    const auth = await authenticateOrRedirect(AUTH_READ_ALL);
    const service = new QuestionnaireService(new QuestionnaireRepository(auth.user.base));
    return await service.getList();
});

export const getQuestionnaire = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Questionnaire|undefined> => {
    const auth = await authenticateOrRedirect(AUTH_READ);
    if(data.id){
      const service = new QuestionnaireService(new QuestionnaireRepository(auth.user.base));
      return await service.get(data.id);
    }
    return undefined;
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {q: Questionnaire}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const service = new QuestionnaireService(new QuestionnaireRepository(auth.user.base));
      return await service.insert(data.q);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {q: Questionnaire}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const service = new QuestionnaireService(new QuestionnaireRepository(auth.user.base));
      return await service.update(data.q);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {q: Questionnaire}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const service = new QuestionnaireService(new QuestionnaireRepository(auth.user.base));
      return await service.delete(data.q);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});