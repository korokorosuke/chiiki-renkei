import { assert, assertFalse, fail } from "@std/assert"
import type { IWebAppRepository } from "../../domain/webAppointmentService.ts"
import type { IWebReservationRepository } from "../../domain/webReservationService.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { IWebDepartmentRepository } from "../../domain/webDepartmentService.ts"
import type { IWebDrRepository } from "../../domain/webDrService.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { IUserRepository } from "../../domain/userService.ts"
import type { WebAppointment } from "../../domain/webAppointment.ts"
import type { WebReservation } from "../../domain/webReservation.ts"
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

const reservation: WebReservation = {
  dept: "01",
  dr: "00001",
  date: "2024-06-07",
  time: "09:00",
  max: 3,
  cnt: 2
}
const reservation2: WebReservation = {
  dept: "02",
  dr: "00001",
  date: "2024-06-08",
  time: "14:30",
  max: 3,
  cnt: 1
}
const reservation3: WebReservation = {
  dept: "01",
  dr: "00002",
  date: "2024-06-07",
  time: "09:30",
  max: 3,
  cnt: 0
}
const reservation4: WebReservation = {
  dept: "02",
  dr: "00001",
  date: "2024-06-20",
  time: "09:30",
  max: 3,
  cnt: 3
}
const reservation5: WebReservation = {
  dept: "02",
  dr: "00003",
  date: "2024-06-25",
  time: "09:30",
  max: 3,
  cnt: 2
}
const appointment0: WebAppointment = {
  id: "0001-00001",
  patient: patient2,
  date: "2024-06-07",
  time: "09:00",
  facility: toFac(facility),
  department: department,
  dr: dr,
  mainComplaint: "",
  cancel: false,
  createdBy: user,
  createdAt: "2024-06-07 12:34:56",
  updatedBy: user,
  updatedAt: "2024-06-07 12:34:56",
}
const appointment: WebAppointment = {
  id: "0001-00001",
  patient: patient,
  date: "2024-06-07",
  time: "09:00",
  facility: toFac(facility),
  department: department,
  dr: dr,
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
  mainComplaint: "",
  cancel: false,
  force: true,
  createdBy: user,
  createdAt: "2024-06-07 12:34:56",
  updatedBy: user,
  updatedAt: "2024-06-07 12:34:56",
}

function compare(app1: WebAppointment, app2: WebAppointment): boolean {
  if(app1.id !== app2.id){
    console.log(`id: ${app1.id} : ${app2.id}`);
    return false;
  }
  if(app1.date !== app2.date){
    console.log(`date: ${app1.date} : ${app2.date}`);
    return false;
  }
  if(app1.time !== app2.time){
    console.log(`time: ${app1.time} : ${app2.time}`);
    return false;
  }
  if(app1.mainComplaint !== app2.mainComplaint){
    console.log(`mainComplaint: ${app1.mainComplaint} : ${app2.mainComplaint}`);
    return false;
  }
  if(app1.patient && app2.patient){
    const p1 = app1.patient;
    const p2 = app2.patient;
    if(p1.id !== p2.id){
      console.log(`patient_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.lastName !== p2.lastName){
      console.log(`patient_name: ${p1.lastName} : ${p2.lastName}`);
      return false;
    }
    if(p1.firstName !== p2.firstName){
      console.log(`patient_name: ${p1.firstName} : ${p2.firstName}`);
      return false;
    }
  }
  if(app1.facility.id !== app2.facility.id){
    console.log(`facilityId: ${app1.facility.id} : ${app2.facility.id}`);
    return false;
  }
  if(app1.department && app2.department){
    const p1 = app1.department;
    const p2 = app2.department;
    if(p1.id !== p2.id){
      console.log(`department_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.name !== p2.name){
      console.log(`department_name: ${p1.name} : ${p2.name}`);
      return false;
    }
  }
  if(app1.dr && app2.dr){
    const p1 = app1.dr;
    const p2 = app2.dr;
    if(p1.id !== p2.id){
      console.log(`dr_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.name !== p2.name){
      console.log(`dr_name: ${p1.name} : ${p2.name}`);
      return false;
    }
  }
  return true;
}

export async function prepare(repoRes: IWebReservationRepository,
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
  await repoRes.insert(reservation);
  await repoRes.insert(reservation2);
  await repoRes.insert(reservation3);
  await repoRes.insert(reservation4);
  await repoRes.insert(reservation5);
}

export async function insert(repo: IWebAppRepository){
  let res = await repo.insert(appointment);
  assert(res);
  res = await repo.insert(appointment2);
  assert(res);
  res = await repo.insert(appointment5);
  assert(res);
  res = await repo.insert(appointment7);
  assert(res);
  res = await repo.insert(appointment0);
  assert(!res);
}
export async function checkCount(repo: IWebReservationRepository){
  let res = await repo.read(reservation.dept, reservation.dr, reservation.date, reservation.time);
  if(res){
    assert(res.cnt === 2);
  }else{
    console.log("res1");
    fail();
  }
  res = await repo.read(reservation2.dept, reservation2.dr, reservation2.date, reservation2.time);
  if(res){
    assert(res.cnt === 2);
  }else{
    console.log("res2");
    fail();
  }
  res = await repo.read(reservation3.dept, reservation3.dr, reservation3.date, reservation3.time);
  if(res){
    assert(res.cnt === 1);
  }else{
    console.log("res3");
    fail();
  }
  res = await repo.read(reservation4.dept, reservation4.dr, reservation4.date, reservation4.time);
  if(res){
    assert(res.cnt === 4);
  }else{
    console.log("res4");
    fail();
  }
}
export async function update(repo: IWebAppRepository){
  let res = await repo.update(appointment3);
  assert(res);
  res = await repo.update(appointment4);
  assert(res);
  res = await repo.update(appointment6);
  assert(res);
  res = await repo.update(appointment8);
  assert(res);
}
export async function read(repo: IWebAppRepository){
  let res = await repo.read(appointment3.id);
  if(res){
    assert(compare(appointment3, res));
  }else{
    console.log("1");
    console.log(res);
    fail();
  }
  res = await repo.read(appointment4.id);
  if(res){
    assert(compare(appointment4, res));
  }else{
    console.log("2");
    console.log(res);
    fail();
  }
}
export async function list(repo: IWebAppRepository){
  let res = await repo.list({fromDate:"2024-06-07", toDate: "2024-06-07"});
  if(res.length === 1){
    assert(compare(appointment3, res[0]));
  }else{
    console.log(res[0]);
    console.log(res[1]);
    console.log(`list1: ${res.length}`)
    fail();
  }
  res = await repo.list({fromDate:"2024-06-01"});
  if(res.length === 4){
    for(const r of res){
      if(r.id === appointment3.id){
        assert(compare(appointment3, r));
      }else if(r.id === appointment4.id){
        assert(compare(appointment4, r));
      }else if(r.id === appointment6.id){
        assert(compare(appointment6, r));
      }else if(r.id === appointment8.id){
        assert(compare(appointment8, r));
      }else{
        fail();
      }
    }
  }else{
    console.log(`list2: ${res.length}`)
    fail();
  }
}
export async function patientList(repo: IWebAppRepository){
  const res = await repo.list({patientId: appointment3.patient.id});
  if(res.length === 1){
    assert(compare(appointment3, res[0]));
  }else{
    console.log(`list1: ${res.length}`)
    fail();
  }
}
export async function del(repo: IWebAppRepository){
  await repo.delete(appointment3);
  let res = await repo.read(appointment3.id);
  assertFalse(res);
  await repo.delete(appointment2);
  res = await repo.read(appointment2.id);
  assertFalse(res);
  await repo.delete(appointment6);
  res = await repo.read(appointment6.id);
  assertFalse(res);
  await repo.delete(appointment8);
  res = await repo.read(appointment8.id);
  assertFalse(res);
}
export async function cleanUp(repoRes: IWebReservationRepository,
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
  await repoRes.delete(reservation);
  await repoRes.delete(reservation2);
  await repoRes.delete(reservation3);
  await repoRes.delete(reservation4);
  await repoRes.delete(reservation5);
}