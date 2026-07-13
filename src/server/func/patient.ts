import { createServerFn } from "@tanstack/solid-start"
import { PatientService } from "../domain/patientService.ts"
import { PatientRepository } from "../infra/allRepository.ts"
import type { Patient } from "../domain/patient.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

const AUTH_READ = [
  {auth: Auth.APPOINT, role: Role.READ},
  {auth: Auth.REFERRAL, role: Role.READ},
];
const AUTH_READ_ALL = {auth: Auth.MASTER, role: Role.READ};
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getPatients = createServerFn({ method: "GET" })
  .validator((data : {name: string}) => data)
  .handler(async ({ data }): Promise<Patient[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      if(data.name){
        const service = new PatientService(new PatientRepository(auth.user!.base));
        return await service.getList(data.name);
      }
    }
    return [];
});

export const getPatient = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<Patient|undefined> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.id){
        const service = new PatientService(new PatientRepository(auth.user!.base));
        return await service.get(data.id);
      }
    }
    return undefined;
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {patient: Patient}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new PatientService(new PatientRepository(auth.user!.base));
      return await service.insert(data.patient);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {patient: Patient}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new PatientService(new PatientRepository(auth.user!.base));
      return await service.update(data.patient);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {patient: Patient}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data.patient){
        const service = new PatientService(new PatientRepository(auth.user!.base));
        await service.delete(data.patient);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});