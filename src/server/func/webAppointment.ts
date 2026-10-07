import { createServerFn } from "@tanstack/solid-start"
import { redirect } from "@tanstack/solid-router"
import { WebAppService } from "../domain/webAppointmentService.ts"
import { AppointmentService } from "../domain/appointmentService.ts"
import { AnswerService } from "../domain/answerService.ts"
import { QuestionnaireService } from "../domain/questionnaireService.ts"
import { WebReservationService } from "../domain/webReservationService.ts"
import {
  WebAppRepository, AppointmentRepository, WebReservationRepository,
  AnswerRepository, AnswerPasswordRepository, QuestionnaireRepository
} from "../infra/allRepository.ts"
import { WebAppointmentRegistration } from "../usecase/webAppointmentRegistration.ts"
import { AppointmentRegistration } from "../usecase/appointmentRegistration.ts"
import { AnswerRegistration } from "../usecase/answerRegistration.ts"
import type { WebAppointment } from "../domain/webAppointment.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, type FetchResult, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

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
          new WebAppRepository(auth.user.base));
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

export const getConsultation = createServerFn({ method: "GET" })
  .validator((data : {facid?: string}) => data)
  .handler(async ({ data }): Promise<WebAppointment[]> => {
    const auth = await authenticate(AUTH_ADMIN_READ);
    if(auth.ok){
      const service = new WebAppService(
        new WebAppRepository(auth.user.base));
      if(data.facid){
        return await service.getConsultation(data.facid);
      }else{
        return await service.getConsultation();
      }
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const getNoID = createServerFn({ method: "GET" })
  .handler(async (): Promise<WebAppointment[]> => {
    const auth = await authenticate(AUTH_ADMIN_READ);
    if(auth.ok){
      const service = new WebAppService(
        new WebAppRepository(auth.user.base));
      return await service.getNoID();
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const getWebAppointments = createServerFn({ method: "GET" })
  .validator((data : {cond: Condition}) => data)
  .handler(async ({ data }): Promise<WebAppointment[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.cond.patid || data.cond.facid || data.cond.from || data.cond.to){
        const service = new WebAppService(
          new WebAppRepository(auth.user.base));
        return await service.getList({patientId: data.cond.patid,
          facilityId: data.cond.facid, fromDate: data.cond.from, toDate: data.cond.to});
      }
      return [];
    }else{
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login'
      });
    }
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {webAppointment: WebAppointment}) => data)
  .handler(async ({ data }): Promise<FetchResult<WebAppointment>> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const usecase = new WebAppointmentRegistration(
          new WebAppService(
            new WebAppRepository(auth.user.base)),
          new AppointmentRegistration(
            new AppointmentService(
              new AppointmentRepository(auth.user.base)),
            new AnswerRegistration(
              new AnswerService(
                new AnswerRepository(auth.user.base),
                new AnswerPasswordRepository(auth.user.base)),
              new QuestionnaireService(
                new QuestionnaireRepository(auth.user.base)))),
          new WebReservationService(
            new WebReservationRepository(auth.user.base)),
        );
        return await usecase.insert(data.webAppointment);
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
  .validator((data : {webAppointment: WebAppointment}) => data)
  .handler(async ({ data }): Promise<FetchResult<WebAppointment>> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const usecase = new WebAppointmentRegistration(
          new WebAppService(
            new WebAppRepository(auth.user.base)),
          new AppointmentRegistration(
            new AppointmentService(
              new AppointmentRepository(auth.user.base)),
            new AnswerRegistration(
              new AnswerService(
                new AnswerRepository(auth.user.base),
                new AnswerPasswordRepository(auth.user.base)),
              new QuestionnaireService(
                new QuestionnaireRepository(auth.user.base)))),
          new WebReservationService(
            new WebReservationRepository(auth.user.base)),
        );
        return await usecase.update(data.webAppointment);
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

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {webAppointment: WebAppointment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      try{
        const usecase = new WebAppointmentRegistration(
          new WebAppService(
            new WebAppRepository(auth.user.base)),
          new AppointmentRegistration(
            new AppointmentService(
              new AppointmentRepository(auth.user.base)),
          new AnswerRegistration(
            new AnswerService(
              new AnswerRepository(auth.user.base),
              new AnswerPasswordRepository(auth.user.base)),
            new QuestionnaireService(
              new QuestionnaireRepository(auth.user.base)))),
          new WebReservationService(
            new WebReservationRepository(auth.user.base)),
        );
        return await usecase.delete(data.webAppointment);
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