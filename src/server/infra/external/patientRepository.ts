import type { Patient, Condition } from "../../domain/patient.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import { PATIENT_URL } from "../../settings.ts"

export class PatientRepository implements IPatientRepository {
  constructor(){
  }
  insert(_: Patient): Promise<boolean> {
    return Promise.reject(new Error("Not implemented"));
  }
  update(_: Patient): Promise<boolean> {
    return Promise.reject(new Error("Not implemented"));
  }
  delete(_: Patient): Promise<void> {
    return Promise.reject(new Error("Not implemented"));
  }
  async read(id: string): Promise<Patient|undefined> {
    try{
      let url = Deno.env.get(PATIENT_URL);
      if(!url){
        return Promise.reject(new Error("No env parameter"));
      }
      if(url.endsWith("/")){
        url = url.substring(0, url.length - 1);
      }
      const res = await fetch(`${url}/${id}`);
      if(res.ok){
        return await res.json() as Patient;
      }
    }catch(e){
      return Promise.reject(e);
    }
    return undefined;
  }
  async list(cond: Condition): Promise<Patient[]> {
    try{
      let url = Deno.env.get(PATIENT_URL);
      if(!url){
        return Promise.reject(new Error("No env parameter"));
      }
      if(url.endsWith("/")){
        url = url.substring(0, url.length - 1);
      }
      const res = await fetch(`${url}/${encodeURIComponent(cond.name)}`);
      if(res.ok){
        return await res.json() as Patient[];
      }
    }catch(e){
      return Promise.reject(e);
    }
    return [];
  }
}