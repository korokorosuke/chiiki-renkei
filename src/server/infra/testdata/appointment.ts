import { assert, assertFalse, fail } from "@std/assert"
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
  department: department,
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
  department: department2,
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
  department: department,
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
  department: department2,
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
  department: department2,
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
  department: department,
  dr: dr2,
  appDisplay: "医者　太郎",
  means: "WEB",
  personInCharge: toUser(user),
  memo: "",
  updatedBy: user,
  updatedAt: "2024-06-07T12:38:56Z",
}

function compare(app1: Appointment, app2: Appointment): boolean {
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
  if(app1.memo !== app2.memo){
    console.log(`memo: ${app1.memo} : ${app2.memo}`);
    return false;
  }
  if(app1.personInCharge && app2.personInCharge){
    const p1 = app1.personInCharge;
    const p2 = app2.personInCharge;
    if(p1.id !== p2.id){
      console.log(`personInCharge_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.name !== p2.name){
      console.log(`personInCharge_name: ${p1.name} : ${p2.name}`);
      return false;
    }
  }
  if(app1.patient && app2.patient){
    const p1 = app1.patient;
    const p2 = app2.patient;
    if(p1.id !== p2.id){
      console.log(`patient_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.lastName !== p2.lastName){
      console.log(`patient_lastname: ${p1.lastName} : ${p2.lastName}`);
      return false;
    }
    if(p1.firstName !== p2.firstName){
      console.log(`patient_firstname: ${p1.firstName} : ${p2.firstName}`);
      return false;
    }
  }
  if(app1.facility && app2.facility){
    const p1 = app1.facility;
    const p2 = app2.facility;
    if(p1.id !== p2.id){
      console.log(`facility_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.name !== p2.name){
      console.log(`facility_name: ${p1.name} : ${p2.name}`);
      return false;
    }
  }
  if(app1.facilityDr !== app2.facilityDr){
    console.log(`facilityDr: ${app1.facilityDr} : ${app2.facilityDr}`);
    return false;
  }
  if(app1.facilityDept && app2.facilityDept){
    if(app1.facilityDept !== app2.facilityDept){
      console.log(`facilityDept_id: ${app1.facilityDept} : ${app2.facilityDept}`);
      return false;
    }
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
  if(app1.means && app2.means){
    if(app1.means !== app2.means){
      console.log(`means_id: ${app1.means} : ${app2.means}`);
      return false;
    }
  }
  return true;
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
  assert(res);
  res = await repo.insert(appointment2);
  assert(res);
}

export async function update(repo: IAppointmentRepository){
  let res = await repo.update(appointment3);
  assert(res);
  res = await repo.update(appointment4);
  assert(res);
}

export async function read(repo: IAppointmentRepository){
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

export async function list(repo: IAppointmentRepository){
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
  if(res.length === 2){
    for(const r of res){
      if(appointment3.id === r.id){
        assert(compare(appointment3, r));
      }else if(appointment4.id === r.id){
        assert(compare(appointment4, r));
      }else{
        fail();
      }
    }
  }else{
    console.log(`list2: ${res.length}`)
    fail();
  }
}
export async function patientList(repo: IAppointmentRepository){
  const res = await repo.list({patientId: patient.id});
  if(res.length === 1){
    assert(compare(appointment3, res[0]));
  }else{
    console.log(`list1: ${res.length}`)
    fail();
  }
}
export async function reportList(repo: IAppointmentRepository){
  let res = await repo.listForReport(appointment3.date);
  if(res.length === 1){
    assert(compare(appointment3, res[0]));
    assert(facility.faxSendNo, res[0].facility.fax);
  }else{
    console.log(`list1: ${res.length}`)
    fail();
  }
  res = await repo.listForReport(appointment3.date, facility.id, department.id);
  if(res.length === 1){
    assert(compare(appointment3, res[0]));
  }else{
    console.log(`list2: ${res.length}`)
    fail();
  }
  res = await repo.listForReport(appointment3.date, facility.id);
  if(res.length === 1){
    assert(compare(appointment3, res[0]));
  }else{
    console.log(`list3: ${res.length}`)
    fail();
  }
  res = await repo.listForReport(appointment3.date, undefined, department.id);
  if(res.length === 1){
    assert(compare(appointment3, res[0]));
  }else{
    console.log(`list4: ${res.length}`)
    fail();
  }
  res = await repo.listForReport(appointment2.date);
  if(res.length === 0){
    assert(true);
  }else{
    console.log(`list5: ${res.length}`)
    fail();
  }
}
export async function del(repo: IAppointmentRepository){
  await repo.delete(appointment3);
  let res = await repo.read(appointment3.id);
  assertFalse(res);
  await repo.delete(appointment2);
  res = await repo.read(appointment2.id);
  assertFalse(res);
}

export async function cleanUp(repoUser: IUserRepository, repoPat: IPatientRepository,
    repoDept: IDepartmentRepository, repoDr: IDrRepository, repoFac: IFacilityRepository) {
  await delFac(repoFac);
  await delPat(repoPat);
  await delDept(repoDept);
  await delDr(repoDr);
  await delUser(repoUser);
}