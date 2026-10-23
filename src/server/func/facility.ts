import { createServerFn, createServerOnlyFn } from "@tanstack/solid-start"
import { FacilityService } from "../domain/facilityService.ts"
import { FacilityRepository } from "../infra/allRepository.ts"
import type { Facility, Fac } from "../domain/facility.ts"
import { authenticateOrRedirect, Auth, Role, verify } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { toFac } from "../lib/types.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"
import { FatalError } from "../lib/types.ts"
import { fatal } from "../lib/log.ts"

const AUTH_READ = {auth: Auth.FACILITY, role: Role.READ};
const AUTH_WRITE = {auth: Auth.FACILITY, role: Role.WRITE};

export const getFacilities = createServerFn({ method: "GET" })
  .validator((data : {name: string}) => data)
  .handler(async ({ data }): Promise<Facility[]> => {
    const auth = await authenticateOrRedirect(AUTH_READ);
    if(data.name){
      const service = new FacilityService(new FacilityRepository(auth.user.base));
      return await service.getList({name: data.name});
    }
    return [];
});

const getFacilityMain =  createServerOnlyFn(
  async function (id: string, base: string): Promise<Facility | undefined> {
    if(id && base){
      const service = new FacilityService(new FacilityRepository(base));
      return await service.get(id);
    }
    return undefined;
});

export const getFacility = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Facility | undefined> => {
    const auth = await authenticateOrRedirect(AUTH_READ);
    return await getFacilityMain(data.id, auth.user.base);
});

export const getFac = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Fac | undefined> => {
    const auth = await authenticateOrRedirect(AUTH_READ);
    const facility = await getFacilityMain(data.id, auth.user.base);
    if(facility){
      return toFac(facility);
    }
    return undefined;
});

export const getUserFac = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Fac | undefined> => {
    const auth = await verify();
    if(auth.ok){
      const facility = await getFacilityMain(data.id, auth.user.base);
      if(facility){
        return toFac(facility);
      }
    }
    return undefined;
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {facility: Facility}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const service = new FacilityService(new FacilityRepository(auth.user.base));
      return await service.insert(data.facility);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {facility: Facility}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const service = new FacilityService(new FacilityRepository(auth.user.base));
      return await service.update(data.facility);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data : {facility: Facility}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticateOrRedirect(AUTH_WRITE);
    try{
      const service = new FacilityService(new FacilityRepository(auth.user.base));
      return await service.delete(data.facility);
    }catch(e){
      if(e instanceof FatalError){
        await fatal(e.title, e.details, auth.user.base, auth.user.id, e.patientId);
      }
      return ng(["処理が失敗しました。管理者にお問い合わせください。"]);
    }
});