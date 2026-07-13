import { createServerFn } from "@tanstack/solid-start"
import { StaffService } from "../domain/staffService.ts"
import { StaffRepository } from "../infra/allRepository.ts"
import type { Staff } from "../domain/staff.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

const AUTH_READ = [
  {auth: Auth.APPOINT, role: Role.READ},
  {auth: Auth.REFERRAL, role: Role.READ},
  {auth: Auth.FACILITY, role: Role.READ},
];
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getDrs = createServerFn({ method: "GET" })
  .validator((data : {facId: string}) => data)
  .handler(async ({ data }): Promise<Staff[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.facId){
        const service = new StaffService(new StaffRepository(auth.user!.base));
        return await service.getDr(data.facId);
      }
    }
    return [];
});

export const getStaffs = createServerFn({ method: "GET" })
  .validator((data : {facId: string}) => data)
  .handler(async ({ data }): Promise<Staff[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.facId){
        const service = new StaffService(new StaffRepository(auth.user!.base));
        return await service.getAll(data.facId);
      }
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {staff: Staff}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new StaffService(new StaffRepository(auth.user!.base));
      return await service.insert(data.staff);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {staff: Staff}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new StaffService(new StaffRepository(auth.user!.base));
      return await service.update(data.staff);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {staff: Staff}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.staff){
        const service = new StaffService(new StaffRepository(auth.user!.base));
        await service.delete(data.staff);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});