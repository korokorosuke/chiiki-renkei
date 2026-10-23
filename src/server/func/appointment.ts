import { createServerFn } from "@tanstack/solid-start"
import { AppointmentService } from "../domain/appointmentService.ts"
import { AnswerService } from "../domain/answerService.ts"
import { QuestionnaireService } from "../domain/questionnaireService.ts"
import {
  AppointmentRepository, AnswerRepository, AnswerPasswordRepository, QuestionnaireRepository
} from "../infra/allRepository.ts"
import { AppointmentRegistration } from "../usecase/appointmentRegistration.ts"
import { AnswerRegistration } from "../usecase/answerRegistration.ts"
import type { Appointment } from "../domain/appointment.ts"
import { authenticateOrRedirect, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

const AUTH_READ = {auth: Auth.APPOINT, role: Role.READ};
const AUTH_DATE_READ = {auth: Auth.STATISTICS, role: Role.READ};
const AUTH_WRITE = [
  {auth: Auth.APPOINT, role: Role.WRITE},
  {auth: Auth.WEB, role: Role.READ}
];

export const getAppointment = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Appointment|undefined> => {
    const auth = await authenticateOrRedirect(AUTH_READ);
    if(data.id){
      const service = new AppointmentService(
        new AppointmentRepository(auth.user.base));
      return await service.get(data.id);
    }
    return undefined;
});

export const getAppointments = createServerFn({ method: "GET" })
  .validator((data : {patientId: string}) => data)
  .handler(async ({ data }): Promise<Appointment[]> => {
    const auth = await authenticateOrRedirect(AUTH_READ);
    if(data.patientId){
      const service = new AppointmentService(
        new AppointmentRepository(auth.user.base));
      return await service.getListByPatient(data.patientId);
    }
    return [];
});

export const getAppointmentsForDate = createServerFn({ method: "GET" })
  .validator((data : {fromDate:string, toDate: string}) => data)
  .handler(async ({ data }): Promise<Appointment[]> => {
    const auth = await authenticateOrRedirect(AUTH_DATE_READ);
    const service = new AppointmentService(
      new AppointmentRepository(auth.user.base));
    return await service.getListByDate(data.fromDate, data.toDate);
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {appointment: Appointment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const usecase = new AppointmentRegistration(
        new AppointmentService(
          new AppointmentRepository(auth.user.base)),
        new AnswerRegistration(
          new AnswerService(
            new AnswerRepository(auth.user.base),
            new AnswerPasswordRepository(auth.user.base)),
          new QuestionnaireService(
            new QuestionnaireRepository(auth.user.base))));
      return await usecase.insert(data.appointment);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {appointment: Appointment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const usecase = new AppointmentRegistration(
        new AppointmentService(
          new AppointmentRepository(auth.user.base)),
        new AnswerRegistration(
          new AnswerService(
            new AnswerRepository(auth.user.base),
            new AnswerPasswordRepository(auth.user.base)),
          new QuestionnaireService(
            new QuestionnaireRepository(auth.user.base))));
      return await usecase.update(data.appointment);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {appointment: Appointment}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const usecase = new AppointmentRegistration(
        new AppointmentService(
          new AppointmentRepository(auth.user.base)),
        new AnswerRegistration(
          new AnswerService(
            new AnswerRepository(auth.user.base),
            new AnswerPasswordRepository(auth.user.base)),
          new QuestionnaireService(
            new QuestionnaireRepository(auth.user.base))));
      return await usecase.delete(data.appointment);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});