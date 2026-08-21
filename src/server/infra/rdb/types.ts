import { type Fac, initializeFac } from "../../domain/facility.ts"
import { type User, initializeUser } from "../../domain/user.ts"
import { type Patient, initialize as initializePatient } from "../../domain/patient.ts"
import type { PatientDBResult as P } from "./patientRepository.ts"

export type UserDBResult = {
  id: string,
  name: string,
  departmentId: string,
};

export function toUser(user: UserDBResult|null): User{
  return user ? {
    id: user.id,
    name: user.name,
    department: user.departmentId,
  } : initializeUser();
}

export type FacilityDBResult = {
  id: string,
  name: string,
  tel: string,
  fax: string,
  addressName: string,
  addressPlus: string,
  notSend?: boolean,
  faxSendNo?: string,
};

export function toFacility(fac: FacilityDBResult|null): Fac {
  return fac ? {
    ...fac,
    address: fac.addressName + fac.addressPlus,
  } : initializeFac();
}

export type DepartmentDBResult = {
  id: string,
  name: string,
};

export type PatientDBResult = P;

export function toPatient(patient: PatientDBResult|null): Patient {
  return patient ? {
    ...patient,
    address: {
      postalCode: patient.postalCode,
      name: patient.addressName,
      plus: patient.addressPlus,
    },
  } : initializePatient();
}