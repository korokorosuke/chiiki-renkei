import { expect } from "vitest"
import type { IAppointmentRepository } from "../../domain/appointmentService.ts"
import type { Appointment } from "../../domain/appointment.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { IDepartmentRepository } from "../../domain/departmentService.ts"
import type { IDrRepository } from "../../domain/drService.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { IUserRepository } from "../../domain/userService.ts"
import { facility, facility2, toFac, insert as insertFac, del as delFac } from "./facility.ts"
import { patient, patient2, insert as insertPat, del as delPat } from "./patient.ts"
import { department, department2, insert as insertDept, del as delDept } from "./dept.ts"
import { dr, dr2, insert as insertDr, del as delDr } from "./dr.ts"
import { user, user2, toUser, insert as insertUser, del as delUser } from "./user.ts"

export const appointment: Appointment = {
  id: "019d617b-df2a-7114-a05c-6687bd38360e",
  patient: patient,
  date: "2024-06-07",
  time: "09:00",
  facility: toFac(facility),
  facilityDr: "医者１",
  facilityDept: "内科",
  department: {id: department.id, name: department.name},
  dr: dr,
  appDisplay: "医者　太郎",
  means: "FAX",
  personInCharge: toUser(user),
  memo: "",
  updatedBy: user,
  updatedAt: "2024-06-07T12:34:56Z",
}
export const appointment2: Appointment = {
  id: "2",
  patient: patient2,
  date: "2024-06-08",
  time: "14:30",
  facility: toFac(facility2),
  facilityDr: "医者２",
  facilityDept: "内科",
  department: {id: department2.id, name: department2.name},
  dr: dr,
  appDisplay: "医者　太郎",
  means: "WEB",
  personInCharge: toUser(user2),
  memo: "",
  updatedBy: user2,
  updatedAt: "2024-06-06T12:34:56Z",
}
export const appointment3: Appointment = {
  id: "019d617b-df2a-7114-a05c-6687bd38360e",
  patient: patient,
  date: "2024-06-07",
  time: "09:00",
  facility: toFac(facility),
  facilityDr: "医者１",
  facilityDept: "内科",
  department: {id: department.id, name: department.name},
  dr: dr2,
  appDisplay: "医者　太郎",
  means: "WEB",
  personInCharge: toUser(user),
  memo: "",
  updatedBy: user,
  updatedAt: "2024-06-07T12:38:56Z",
}
export const appointment4: Appointment = {
  id: "2",
  patient: patient2,
  date: "2024-06-09",
  time: "14:30",
  facility: toFac(facility2),
  facilityDr: "医者２",
  facilityDept: "内科",
  department: {id: department2.id, name: department2.name},
  dr: dr,
  appDisplay: "医者　太郎",
  means: "FAX",
  personInCharge: toUser(user2),
  memo: "",
  updatedBy: user2,
  updatedAt: "2024-06-07T12:34:56Z",
}
export const appointment5: Appointment = {
  id: "2",
  patient: patient2,
  date: "2024-06-09",
  time: "14:30",
  facility: toFac(facility),
  facilityDr: "医者２",
  facilityDept: "内科",
  department: {id: department2.id, name: department2.name},
  dr: dr,
  appDisplay: "医者　太郎ああああああああああああああああああああああああああああああああああああ",
  means: "FAX",
  personInCharge: toUser(user2),
  memo: "",
  updatedBy: user2,
  updatedAt: "2024-06-07T12:34:56Z",
}
export const appointment6: Appointment = {
  id: "019d617b-df2a-7114-a05c-6687bd38360f",
  patient: patient2,
  date: "2024-06-07",
  time: "09:00",
  facility: toFac(facility),
  facilityDr: "医者１",
  facilityDept: "内科",
  department: {id: department.id, name: department.name},
  dr: dr2,
  appDisplay: "医者　太郎",
  means: "WEB",
  personInCharge: toUser(user),
  memo: "",
  updatedBy: user,
  updatedAt: "2024-06-07T12:38:56Z",
}

function omitTimestamps(val: Appointment|undefined): Omit<Appointment, "updatedAt"|"updatedBy">|undefined {
  if(val){
    const {updatedAt, updatedBy, ...value} = val;
    return value;
  }else{
    return undefined;
  }
}

export async function prepare(repoUser: IUserRepository, repoPat: IPatientRepository,
    repoDept: IDepartmentRepository, repoDr: IDrRepository, repoFac: IFacilityRepository) {
  await insertFac(repoFac);
  await insertPat(repoPat);
  await insertDept(repoDept);
  await insertDr(repoDr);
  await insertUser(repoUser);
}

export async function insert(repo: IAppointmentRepository){
  let res = await repo.insert(appointment);
  expect(res).toBe(true);
  res = await repo.insert(appointment2);
  expect(res).toBe(true);
}

export async function update(repo: IAppointmentRepository){
  let res = await repo.update(appointment3);
  expect(res).toBe(true);
  res = await repo.update(appointment4);
  expect(res).toBe(true);
}

export async function read(repo: IAppointmentRepository){
  let res = await repo.read(appointment3.id);
  expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(res));
  res = await repo.read(appointment4.id);
  expect(omitTimestamps(appointment4)).toEqual(omitTimestamps(res));
}

export async function list(repo: IAppointmentRepository){
  let res = await repo.list({fromDate:"2024-06-07", toDate: "2024-06-07"});
  if(res.length === 1){
    expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(res[0]);
    console.log(res[1]);
    console.log(`list1: ${res.length}`)
    expect.fail();
  }
  res = await repo.list({fromDate:"2024-06-01"});
  if(res.length === 2){
    for(const r of res){
      if(appointment3.id === r.id){
        expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(r));
      }else if(appointment4.id === r.id){
        expect(omitTimestamps(appointment4)).toEqual(omitTimestamps(r));
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`list2: ${res.length}`)
    expect.fail();
  }
}
export async function patientList(repo: IAppointmentRepository){
  const res = await repo.list({patientId: patient.id});
  if(res.length === 1){
    expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`list1: ${res.length}`)
    expect.fail();
  }
}
export async function reportList(repo: IAppointmentRepository){
  let res = await repo.listForReport(appointment3.date);
  if(res.length === 1){
    expect(facility.faxSendNo).toBe(res[0].facility.fax);
    appointment3.facility.fax = facility.faxSendNo;
    expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`list1: ${res.length}`)
    expect.fail();
  }
  res = await repo.listForReport(appointment3.date, facility.id, department.id);
  if(res.length === 1){
    expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`list2: ${res.length}`)
    expect.fail();
  }
  res = await repo.listForReport(appointment3.date, facility.id);
  if(res.length === 1){
    expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`list3: ${res.length}`)
    expect.fail();
  }
  res = await repo.listForReport(appointment3.date, undefined, department.id);
  if(res.length === 1){
    expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`list4: ${res.length}`)
    expect.fail();
  }
  res = await repo.listForReport(appointment2.date);
  expect(res.length).toBe(0);
}
export async function del(repo: IAppointmentRepository){
  await repo.delete(appointment3);
  let res = await repo.read(appointment3.id);
  expect(res).toBeUndefined();
  await repo.delete(appointment2);
  res = await repo.read(appointment2.id);
  expect(res).toBeUndefined();
}

export async function cleanUp(repoUser: IUserRepository, repoPat: IPatientRepository,
    repoDept: IDepartmentRepository, repoDr: IDrRepository, repoFac: IFacilityRepository) {
  await delFac(repoFac);
  await delPat(repoPat);
  await delDept(repoDept);
  await delDr(repoDr);
  await delUser(repoUser);
}