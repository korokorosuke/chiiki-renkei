import { createServerFn } from "@tanstack/solid-start"
import { FacilityService } from "../domain/facilityService.ts"
import { FacilityRepository } from "../infra/allRepository.ts"
import type { Facility, Fac } from "../domain/facility.ts"
import { authenticate, Auth, Role, verify } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"
import { toFac } from "../lib/types.ts"

const AUTH_READ = {auth: Auth.FACILITY, role: Role.READ};
const AUTH_WRITE = {auth: Auth.FACILITY, role: Role.WRITE};

export const getFacilities = createServerFn({ method: "GET" })
  .validator((data : {name: string}) => data)
  .handler(async ({ data }): Promise<Facility[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.name){
        const service = new FacilityService(new FacilityRepository(auth.user!.base));
        return await service.getList({name: data.name});
      }
    }
    return [];
});

async function getFacilityMain(id: string): Promise<Facility | undefined> {
  const auth = await authenticate(AUTH_READ);
  if(auth.ok){
    if(id){
      const service = new FacilityService(new FacilityRepository(auth.user!.base));
      return await service.get(id);
    }
  }
  return undefined;
}

export const getFacility = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Facility | undefined> => {
    return await getFacilityMain(data.id);
});

export const getFac = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Fac | undefined> => {
    const fac = await getFacilityMain(data.id);
    if(fac){
      return toFac(fac);
    }
    return undefined;
});

export const getUserFac = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Fac | undefined> => {
    const auth = await verify();
    if(auth.ok){
      if(data.id){
        const service = new FacilityService(new FacilityRepository(auth.user!.base));
        const fac = await service.get(data.id);
        if(fac){
          return toFac(fac);
        }
      }
    }
    return undefined;
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {facility: Facility}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new FacilityService(new FacilityRepository(auth.user!.base));
      return await service.insert(data.facility);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {facility: Facility}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new FacilityService(new FacilityRepository(auth.user!.base));
      return await service.update(data.facility);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {facility: Facility}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.facility){
        const service = new FacilityService(new FacilityRepository(auth.user!.base));
        await service.delete(data.facility);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});