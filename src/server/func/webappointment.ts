import { createServerFn } from "@tanstack/solid-start"
import { WebAppService } from "../domain/webAppointmentService.ts"
import { AppointmentService } from "../domain/appointmentService.ts"
import { AnswerService } from "../domain/answerService.ts"
import { QuestionnaireService } from "../domain/questionnaireService.ts"
import {
  WebAppRepository, AppointmentRepository,
  AnswerRepository, AnswerPasswordRepository, QuestionnaireRepository
} from "../infra/allRepository.ts"
import { WebAppointmentRegistration } from "../usecase/webAppointmentRegistration.ts"
import { AppointmentRegistration } from "../usecase/appointmentRegistration.ts"
import { AnswerRegistration } from "../usecase/answerRegistration.ts"
import type { WebAppointment } from "../domain/webAppointment.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, type FetchResult, ok, ng } from "../lib/response.ts"

const AUTH_READ = {auth: Auth.WEB, role: Role.READ};
const AUTH_WRITE = {auth: Auth.WEB, role: Role.READ};
const AUTH_ADMIN_READ = {auth: Auth.WEB, role: Role.WRITE};

interface Condition {
  patid?: string
  facid?: string
  from?: string
  to?: string
}

export const getWebAppointment = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<WebAppointment | undefined> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.id){
        const service = new WebAppService(
          new WebAppRepository(auth.user!.base));
        return await service.get(data.id);
      }
    }
    return undefined;
});

export const getConsultation = createServerFn({ method: "GET" })
  .validator((data : {facid?: string}) => data)
  .handler(async ({ data }): Promise<WebAppointment[]> => {
    const auth = await authenticate(AUTH_ADMIN_READ);
    if(auth.ok){
      const service = new WebAppService(
        new WebAppRepository(auth.user!.base));
      if(data.facid){
        return await service.getConsultation(data.facid);
      }else{
        return await service.getConsultation();
      }
    }
    return [];
});

export const getNoID = createServerFn({ method: "GET" })
  .handler(async (): Promise<WebAppointment[]> => {
    const auth = await authenticate(AUTH_ADMIN_READ);
    if(auth.ok){
      const service = new WebAppService(
        new WebAppRepository(auth.user!.base));
      return await service.getNoID();
    }
    return [];
});

export const getWebAppointments = createServerFn({ method: "GET" })
  .validator((data : {cond: Condition}) => data)
  .handler(async ({ data }): Promise<WebAppointment[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.cond.patid || data.cond.facid || data.cond.from || data.cond.to){
        const service = new WebAppService(
          new WebAppRepository(auth.user!.base));
        return await service.getList({patientId: data.cond.patid,
          facilityId: data.cond.facid, fromDate: data.cond.from, toDate: data.cond.to});
      }
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {appointment: WebAppointment}) => data)
  .handler(async ({ data }): Promise<FetchResult<WebAppointment>> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const usecase = new WebAppointmentRegistration(
        new WebAppService(
          new WebAppRepository(auth.user!.base)),
        new AppointmentRegistration(
          new AppointmentService(
            new AppointmentRepository(auth.user!.base)),
          new AnswerRegistration(
            new AnswerService(
              new AnswerRepository(auth.user!.base),
              new AnswerPasswordRepository(auth.user!.base)),
            new QuestionnaireService(
              new QuestionnaireRepository(auth.user!.base)))));
      return await usecase.insert(data.appointment);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {appointment: WebAppointment}) => data)
  .handler(async ({ data }): Promise<FetchResult<WebAppointment>> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const usecase = new WebAppointmentRegistration(
        new WebAppService(
          new WebAppRepository(auth.user!.base)),
        new AppointmentRegistration(
          new AppointmentService(
            new AppointmentRepository(auth.user!.base)),
          new AnswerRegistration(
            new AnswerService(
              new AnswerRepository(auth.user!.base),
              new AnswerPasswordRepository(auth.user!.base)),
            new QuestionnaireService(
              new QuestionnaireRepository(auth.user!.base)))));
      return await usecase.update(data.appointment);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {appointment: WebAppointment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.appointment){
        const usecase = new WebAppointmentRegistration(
          new WebAppService(
            new WebAppRepository(auth.user!.base)),
          new AppointmentRegistration(
            new AppointmentService(
              new AppointmentRepository(auth.user!.base)),
          new AnswerRegistration(
            new AnswerService(
              new AnswerRepository(auth.user!.base),
              new AnswerPasswordRepository(auth.user!.base)),
            new QuestionnaireService(
              new QuestionnaireRepository(auth.user!.base)))));
        await usecase.delete(data.appointment);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});