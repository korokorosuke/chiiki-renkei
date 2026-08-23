import { createServerFn } from "@tanstack/solid-start"
import { QuestionnaireService } from "../domain/questionnaireService.ts"
import { QuestionnaireRepository } from "../infra/allRepository.ts"
import type { Questionnaire } from "../domain/questionnaire.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"

const AUTH_READ = [
  {auth: Auth.APPOINT, role: Role.READ},
  {auth: Auth.REFERRAL, role: Role.READ},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_READ_ALL = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getQuestionnaires = createServerFn({ method: "GET" })
  .handler(async (): Promise<Questionnaire[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new QuestionnaireService(new QuestionnaireRepository(auth.user!.base));
      return await service.getList();
    }
    return [];
});

export const getQuestionnaire = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Questionnaire|undefined> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.id){
        const service = new QuestionnaireService(new QuestionnaireRepository(auth.user!.base));
        return await service.get(data.id);
      }
    }
    return undefined;
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {q: Questionnaire}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new QuestionnaireService(new QuestionnaireRepository(auth.user!.base));
      return await service.insert(data.q);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {q: Questionnaire}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new QuestionnaireService(new QuestionnaireRepository(auth.user!.base));
      return await service.update(data.q);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {q: Questionnaire}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new QuestionnaireService(new QuestionnaireRepository(auth.user!.base));
      return await service.delete(data.q);
    }
    return ng(auth.errors!);
});