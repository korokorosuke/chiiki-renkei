import { createServerFn } from "@tanstack/solid-start"
import { PatientService } from "../domain/patientService.ts"
import { WebAppService } from "../domain/webAppointmentService.ts"
import { PatientRepository, WebAppRepository } from "../infra/allRepository.ts"
import type { Patient } from "../domain/patient.ts"
import { authenticateOrRedirect, Auth, Role } from "../lib/auth.ts"
import { type FetchResult, okWithData, ng} from "../lib/response.ts"

const AUTH_READ = {auth: Auth.WEB, role: Role.READ};
const AUTH_MASTER = {auth: Auth.WEB, role: Role.WRITE};

export const getPatientForId = createServerFn({ method: "GET" })
  .validator((data : {id: string}) => data)
  .handler(async ({ data }): Promise<FetchResult<Patient>> => {
    const auth = await authenticateOrRedirect(AUTH_MASTER);

    if(!data.id){
      return ng(["パラメータが不正です。"]);
    }

    const service = new PatientService(new PatientRepository(auth.user.base));
    const p = await service.get(data.id);
    if(p){
      return okWithData(p);
    }else{
      return ng(["データが存在しません。"]);
    }
});

export const getPatient = createServerFn({ method: "GET" })
  .validator((data : {facPatId: string}) => data)
  .handler(async ({ data }): Promise<FetchResult<Patient>> => {
    const auth = await authenticateOrRedirect(AUTH_READ);

    if(!data.facPatId){
      return ng(["患者IDを入力してください。"]);
    }

    const service = new WebAppService(new WebAppRepository(auth.user.base));
    const app = await service.getByFacPatientId(auth.user.facilityId!, data.facPatId)
    if(app){
      return okWithData(app.patient);
    }
    return ng(["対象データがありません。"]);
});