import { createServerFn } from "@tanstack/solid-start"
import { WebReservationService } from "../domain/webReservationService.ts"
import { WebReservationRepository } from "../infra/allRepository.ts"
import type { WebReservation } from "../domain/webReservation.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

const AUTH_READ = [
  {auth: Auth.WEB, role: Role.READ},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getWebReservations = createServerFn({ method: "GET" })
  .validator((data : {dept: string, date: string, dr?: string}) => data)
  .handler(async ({ data }): Promise<WebReservation[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      const service = new WebReservationService(new WebReservationRepository(auth.user!.base));
      if(data.dept && data.dr && data.date){
          return await service.getList(data.dept, data.dr, data.date);
      }else if(data.dept && data.date){
          return await service.getListByDate(data.dept, data.date);
      }
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {reservation: WebReservation}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebReservationService(new WebReservationRepository(auth.user!.base));
      return await service.insert(data.reservation);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {reservation: WebReservation}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new WebReservationService(new WebReservationRepository(auth.user!.base));
      return await service.update(data.reservation);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {reservation: WebReservation}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.reservation){
        const service = new WebReservationService(new WebReservationRepository(auth.user!.base));
        await service.delete(data.reservation);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }
    return ng(auth.errors!);
});