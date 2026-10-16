import { expect } from "vitest"
import type { IWebAppRepository } from "../../domain/webAppointmentService.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { IWebDepartmentRepository } from "../../domain/webDepartmentService.ts"
import type { IWebDrRepository } from "../../domain/webDrService.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { IUserRepository } from "../../domain/userService.ts"
import type { WebAppointment } from "../../domain/webAppointment.ts"
import { facility, toFac } from "./facility.ts"
import { patient, patient2 } from "./patient.ts"
import { dr, dr2, dr4 } from "./webDr.ts"
import { department, department2 } from "./webDept.ts"
import { user } from "./user.ts"
import { initWebDr } from "../../lib/types.ts"
import { insert as insertFac, del as delFac } from "./facility.ts"
import { insert as insertPat, del as delPat } from "./patient.ts"
import { insert as insertDept, del as delDept } from "./webDept.ts"
import { insert as insertDr, del as delDr } from "./webDr.ts"
import { insert as insertUser, del as delUser } from "./user.ts"
import { DATE_EMPTY } from "../../domain/webAppointmentService.ts"

const appointment: WebAppointment = {
  id: "0001-00001",
  patient: patient,
  date: "2024-06-07",
  time: "09:00",
  facility: toFac(facility),
  department: department,
  dr: dr,
  facPatientId: "",
  mainComplaint: "",
  cancel: false,
  createdBy: user,
  createdAt: "2024-06-07 12:34:56",
  updatedBy: user,
  updatedAt: "2024-06-07 12:34:56",
}
const appointment2: WebAppointment = {
  id: "0002-11111",
  patient: patient2,
  date: "2024-06-08",
  time: "14:30",
  facility: toFac(facility),
  department: department2,
  dr: dr,
  facPatientId: "",
  mainComplaint: "",
  cancel: false,
  createdBy: user,
  createdAt: "2024-06-07 12:34:56",
  updatedBy: user,
  updatedAt: "2024-06-06 12:34:56",
}
const appointment3: WebAppointment = {
  id: "0001-00001",
  patient: patient,
  date: "2024-06-07",
  time: "09:30",
  facility: toFac(facility),
  department: department,
  dr: dr2,
  facPatientId: "",
  mainComplaint: "",
  cancel: false,
  createdBy: user,
  createdAt: "2024-06-07 12:34:56",
  updatedBy: user,
  updatedAt: "2024-06-07 12:38:56",
}
const appointment4: WebAppointment = {
  id: "0002-11111",
  patient: patient2,
  date: "2024-06-08",
  time: "14:30",
  facility: toFac(facility),
  department: department2,
  dr: dr,
  facPatientId: "",
  mainComplaint: "",
  cancel: false,
  createdBy: user,
  createdAt: "2024-06-07 12:34:56",
  updatedBy: user,
  updatedAt: "2024-06-07 12:34:56",
}
const appointment5: WebAppointment = {
  id: "0006-11111",
  patient: patient2,
  date: DATE_EMPTY,
  time: "",
  facility: toFac(facility),
  department: department2,
  dr: initWebDr(),
  facPatientId: "",
  mainComplaint: "",
  cancel: false,
  consultation: {first: "2024-06-20", second: "", etc: ""},
  createdBy: user,
  createdAt: "2024-06-07 12:34:56",
  updatedBy: user,
  updatedAt: "2024-06-07 12:34:56",
}
const appointment6: WebAppointment = {
  id: "0006-11111",
  patient: patient2,
  date: "2024-06-20",
  time: "09:30",
  facility: toFac(facility),
  department: department2,
  dr: dr,
  facPatientId: "",
  mainComplaint: "",
  cancel: false,
  force: true,
  createdBy: user,
  createdAt: "2024-06-07 12:34:56",
  updatedBy: user,
  updatedAt: "2024-06-07 12:34:56",
}
const appointment7: WebAppointment = {
  id: "0008-11111",
  patient: patient2,
  date: DATE_EMPTY,
  time: "",
  facility: toFac(facility),
  department: department2,
  dr: initWebDr(),
  facPatientId: "",
  mainComplaint: "",
  cancel: false,
  consultation: {first: "2024-06-20", second: "", etc: ""},
  createdBy: user,
  createdAt: "2024-06-07 12:34:56",
  updatedBy: user,
  updatedAt: "2024-06-07 12:34:56",
}
const appointment8: WebAppointment = {
  id: "0008-11111",
  patient: patient2,
  date: "2024-06-25",
  time: "09:30",
  facility: toFac(facility),
  department: department2,
  dr: dr4,
  facPatientId: "",
  mainComplaint: "",
  cancel: false,
  force: true,
  createdBy: user,
  createdAt: "2024-06-07 12:34:56",
  updatedBy: user,
  updatedAt: "2024-06-07 12:34:56",
}

function omitData(val: WebAppointment|undefined): Omit<WebAppointment, "updatedAt"|"updatedBy"|"createdAt"|"createdBy">|undefined {
  if(val){
    const {createdAt, createdBy, updatedAt, updatedBy, force, ...value} = val;
    let app: Omit<WebAppointment, "updatedAt"|"updatedBy"|"createdAt"|"createdBy">
    if(val.force){
      app = {...value, force: true};
    }
    app = value;
    return app;
  }
  return undefined;
}

export async function prepare(
    repoUser?: IUserRepository, repoPat?: IPatientRepository,
    repoDept?: IWebDepartmentRepository, repoDr?: IWebDrRepository, repoFac?: IFacilityRepository) {
  if(repoFac){
    await insertFac(repoFac);
  }
  if(repoPat){
    await insertPat(repoPat);
  }
  if(repoDept){
    await insertDept(repoDept);
  }
  if(repoDr){
    await insertDr(repoDr);
  }
  if(repoUser){
    await insertUser(repoUser);
  }
}

export async function insert(repo: IWebAppRepository){
  let res = await repo.insert(appointment);
  expect(res).toBe(true);
  res = await repo.insert(appointment2);
  expect(res).toBe(true);
  res = await repo.insert(appointment5);
  expect(res).toBe(true);
  res = await repo.insert(appointment7);
  expect(res).toBe(true);
}
export async function update(repo: IWebAppRepository){
  let res = await repo.update(appointment3);
  expect(res).toBe(true);
  res = await repo.update(appointment4);
  expect(res).toBe(true);
  res = await repo.update(appointment6);
  expect(res).toBe(true);
  res = await repo.update(appointment8);
  expect(res).toBe(true);
}
export async function read(repo: IWebAppRepository){
  let res = await repo.read(appointment3.id);
  expect(omitData(appointment3)).toEqual(omitData(res));
  res = await repo.read(appointment4.id);
  expect(omitData(appointment4)).toEqual(omitData(res));
}
export async function list(repo: IWebAppRepository){
  let res = await repo.list({fromDate:"2024-06-07", toDate: "2024-06-07"});
  if(res.length === 1){
    expect(omitData(appointment3)).toEqual(omitData(res[0]));
  }else{
    console.log(res[0]);
    console.log(res[1]);
    console.log(`list1: ${res.length}`)
    expect.fail();
  }
  res = await repo.list({fromDate:"2024-06-01"});
  if(res.length === 4){
    for(const r of res){
      if(r.id === appointment3.id){
        expect(omitData(appointment3)).toEqual(omitData(r));
      }else if(r.id === appointment4.id){
        expect(omitData(appointment4)).toEqual(omitData(r));
      }else if(r.id === appointment6.id){
        expect(omitData(appointment6)).toEqual(omitData(r));
      }else if(r.id === appointment8.id){
        expect(omitData(appointment8)).toEqual(omitData(r));
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`list2: ${res.length}`)
    expect.fail();
  }
}
export async function patientList(repo: IWebAppRepository){
  const res = await repo.list({patientId: appointment3.patient.id});
  if(res.length === 1){
    expect(omitData(appointment3)).toEqual(omitData(res[0]));
  }else{
    console.log(`list1: ${res.length}`)
    expect.fail();
  }
}
export async function del(repo: IWebAppRepository){
  await repo.delete(appointment3);
  let res = await repo.read(appointment3.id);
  expect(res).toBeUndefined();
  await repo.delete(appointment2);
  res = await repo.read(appointment2.id);
  expect(res).toBeUndefined();
  await repo.delete(appointment6);
  res = await repo.read(appointment6.id);
  expect(res).toBeUndefined();
  await repo.delete(appointment8);
  res = await repo.read(appointment8.id);
  expect(res).toBeUndefined();
}
export async function cleanUp(
    repoUser?: IUserRepository, repoPat?: IPatientRepository,
    repoDept?: IWebDepartmentRepository, repoDr?: IWebDrRepository, repoFac?: IFacilityRepository) {
  if(repoFac){
    await delFac(repoFac);
  }
  if(repoPat){
    await delPat(repoPat);
  }
  if(repoDept){
    await delDept(repoDept);
  }
  if(repoDr){
    await delDr(repoDr);
  }
  if(repoUser){
    await delUser(repoUser);
  }
}