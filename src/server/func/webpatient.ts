import { createServerFn } from "@tanstack/solid-start"
import { PatientService } from "../domain/patientService.ts"
import { PatientRepository } from "../infra/allRepository.ts"
import type { Patient } from "../domain/patient.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type FetchResult, ng} from "../lib/response.ts"

const AUTH_READ = {auth: Auth.WEB, role: Role.READ};
const AUTH_MASTER = {auth: Auth.WEB, role: Role.WRITE};

export const getPatientForId = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<FetchResult<Patient>> => {
    const auth = await authenticate(AUTH_MASTER);
    if(!auth.ok){
      return ng(auth.errors!);
    }

    if(!data.id){
      return ng(["パラメータが不正です。"]);
    }

    const service = new PatientService(new PatientRepository(auth.user!.base));
    const p = await service.get(data.id);
    if(p){
      return {ok: true, data: p};
    }else{
      return ng(["データが存在しません。"]);
    }
});

export const getPatient = createServerFn({ method: "GET" })
  .validator((data : {id: string, birthday: string}) => data)
  .handler(async ({ data }): Promise<FetchResult<Patient>> => {
    const auth = await authenticate(AUTH_READ);
    if(!auth.ok){
      return ng(auth.errors!);
    }

    if(!data.id || !data.birthday){
      return ng(["パラメータが不正です。"]);
    }

    const service = new PatientService(new PatientRepository(auth.user!.base));
    const p = await service.get(data.id);
    if(p && (p.birthday === data.birthday)){
      return {ok: true, data: p};
    }else{
      return ng(["患者IDと生年月日が一致しません。"]);
    }
});