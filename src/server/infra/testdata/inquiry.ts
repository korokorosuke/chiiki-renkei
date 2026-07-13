import { assert, assertFalse, fail } from "@std/assert"
import type { IInquiryRepository } from "../../domain/inquiryService.ts"
import type { IDueRepository } from "../../domain/dueService.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { IUserRepository } from "../../domain/userService.ts"
import type { Inquiry } from "../../domain/inquiry.ts"
import { user, user2 } from "./user.ts"
import { due, due2 } from "./due.ts"
import { facility, facility2, toFac } from "./facility.ts"
import { patient, patient2, patient6, patientName } from "./patient.ts"

export const inquiry: Inquiry = {
  id: "0001-00001",
  patient: patient,
  datetime: "2024-06-07T10:30",
  facility: toFac(facility),
  facilityStaff: "斎藤",
  personInCharge: user,
  tel: "03-1234-5678",
  due: due,
  details: "といあわせがありました",
  done: true,
  responses: [{
    responder: {id:"00001",name:"管理者ユーザー",department:""},
    datetime: "2024-06-28T10:50",
    details: "連絡した",
  },{
    responder: {id:"00001",name:"管理者ユーザー",department:""},
    datetime: "2024-06-28T11:30",
    details: "連絡したよ",
  }]
}
export const inquiry2: Inquiry = {
  id: "0002-11111",
  patient: patient2,
  datetime: "2024-06-08T00:00",
  facility: toFac(facility2),
  facilityStaff: "",
  personInCharge: user2,
  tel: "03-1234-5678",
  due: due2,
  details: "といあわせがありました",
  done: false,
  responses: []
}
export const inquiry3: Inquiry = {
  id: "0001-00001",
  patient: patient,
  datetime: "2024-06-07T10:30",
  facility: toFac(facility),
  facilityStaff: "斎藤",
  personInCharge: user,
  tel: "03-1234-5678",
  due: due,
  details: "といあわせがありました",
  done: true,
  responses: [{
    responder: {id:"00001",name:"管理者ユーザー",department:""},
    datetime: "2024-06-28T10:50",
    details: "連絡した",
  },{
    responder: {id:"00001",name:"管理者ユーザー",department:""},
    datetime: "2024-06-28T11:30",
    details: "連絡したよ",
  },{
    responder: {id:"00001",name:"管理者ユーザー",department:""},
    datetime: "2024-06-28T15:30",
    details: "連絡したよね",
  }]
}
export const inquiry4: Inquiry = {
  id: "0002-11111",
  patient: patientName,
  datetime: "2024-06-08T00:00",
  facility: toFac(facility2),
  facilityStaff: "たらちゃんDr",
  personInCharge: user2,
  tel: "03-1234-5678",
  due: due2,
  details: "といあわせがありました",
  done: false,
  responses: []
}
export const inquiry5: Inquiry = {
  id: "0003-11111",
  patient: patientName,
  datetime: "2024-06-25T00:00",
  facility: toFac(facility),
  facilityStaff: "たらちゃんDr",
  personInCharge: user2,
  tel: "03-1234-5678",
  due: due2,
  details: "といあわせがありました",
  done: false,
  responses: []
}
export const inquiry6: Inquiry = {
  id: "0003-11111",
  patient: patient6,
  datetime: "2024-06-25T00:00",
  facility: toFac(facility2),
  facilityStaff: "たらちゃんDr",
  personInCharge: user2,
  tel: "03-1234-5678",
  due: due2,
  details: "といあわせがありました",
  done: false,
  responses: []
}

function compare(val1: Inquiry, val2: Inquiry): boolean {
  if(val1.id !== val2.id){
    console.log(`id: ${val1.id} : ${val2.id}`);
    return false;
  }
  if(val1.datetime !== val2.datetime){
    console.log(`date: ${val1.datetime} : ${val2.datetime}`);
    return false;
  }
  if(val1.facilityStaff !== val2.facilityStaff){
    console.log(`facilityStaff: ${val1.facilityStaff} : ${val2.facilityStaff}`);
    return false;
  }
  if(val1.tel !== val2.tel){
    console.log(`tel: ${val1.tel} : ${val2.tel}`);
    return false;
  }
  if(val1.due && val2.due){
    const v1 = val1.due;
    const v2 = val2.due;
    if(v1.id !== v2.id){
      console.log(`due_id: ${v1.id} : ${v2.id}`);
      return false;
    }
    if(v1.name !== v2.name){
      console.log(`due_name: ${v1.name} : ${v2.name}`);
      return false;
    }
    if(v1.days !== v2.days){
      console.log(`due_name: ${v1.days} : ${v2.days}`);
      return false;
    }
  }
  if(val1.personInCharge && val2.personInCharge){
    const v1 = val1.personInCharge;
    const v2 = val2.personInCharge;
    if(v1.id !== v2.id){
      console.log(`personInCharge_id: ${v1.id} : ${v2.id}`);
      return false;
    }
    if(v1.name !== v2.name){
      console.log(`personInCharge_name: ${v1.name} : ${v2.name}`);
      return false;
    }
  }
  if(val1.patient && val2.patient){
    const v1 = val1.patient;
    const v2 = val2.patient;
    if(v1.id !== v2.id){
      console.log(`patient_id: ${v1.id} : ${v2.id}`);
      return false;
    }
    if(v1.lastName !== v2.lastName){
      console.log(`patient_name: ${v1.lastName} : ${v2.lastName}`);
      return false;
    }
    if(v1.firstName !== v2.firstName){
      console.log(`patient_name: ${v1.firstName} : ${v2.firstName}`);
      return false;
    }
  }
  if(val1.facility && val2.facility){
    const v1 = val1.facility;
    const v2 = val2.facility;
    if(v1.id !== v2.id){
      console.log(`facility_id: ${v1.id} : ${v2.id}`);
      return false;
    }
    if(v1.name !== v2.name){
      console.log(`facility_name: ${v1.name} : ${v2.name}`);
      return false;
    }
  }
  for(let i = 0; i < val1.responses.length; i++){
    if(val1.facility && val2.facility){
      const v1 = val1.facility;
      const v2 = val2.facility;
      if(v1.id !== v2.id){
        console.log(`facility_id: ${v1.id} : ${v2.id}`);
        return false;
      }
      if(v1.name !== v2.name){
        console.log(`facility_name: ${v1.name} : ${v2.name}`);
        return false;
      }
    }
  }
  return true;
}

export async function prepare(repoDue: IDueRepository,
    repoFac: IFacilityRepository, repoPat: IPatientRepository, repoUser: IUserRepository){
  await repoDue.insert(due);
  await repoDue.insert(due2);
  await repoFac.insert(facility);
  await repoFac.insert(facility2);
  await repoPat.insert(patient);
  await repoPat.insert(patient2);
  await repoPat.insert(patient6);
  await repoUser.insert(user);
  await repoUser.insert(user2);
}

export async function insert(repo: IInquiryRepository){
  let res = await repo.insert(inquiry);
  assert(res);
  res = await repo.insert(inquiry2);
  assert(res);
  res = await repo.insert(inquiry5);
  assert(res);
}
export async function update(repo: IInquiryRepository){
  let res = await repo.update(inquiry3);
  assert(res);
  res = await repo.update(inquiry4);
  assert(res);
  res = await repo.update(inquiry6);
  assert(res);
}
export async function read(repo: IInquiryRepository){
  let res = await repo.read(inquiry3.id);
  if(res){
    assert(compare(inquiry3, res));
  }else{
    fail();
  }
  res = await repo.read(inquiry4.id);
  if(res){
    assert(compare(inquiry4, res));
  }else{
    fail();
  }
}
export async function list(repo: IInquiryRepository){
  let res = await repo.list({fromDate:"2024-06-07", toDate: "2024-06-07"});
  if(res.length === 1){
    assert(compare(inquiry3, res[0]));
  }else{
    console.log(`list1: ${res.length}`);
    fail();
  }
  res = await repo.list({fromDate:"2024-06-01"});
  if(res.length === 3){
    for(const r of res){
      if(r.id === inquiry3.id) {
        assert(compare(inquiry3, r));
      }else if(r.id === inquiry4.id) {
        assert(compare(inquiry4, r));
      }else if(r.id === inquiry6.id) {
        assert(compare(inquiry6, r));
      }
    }
  }else{
    console.log(`list2: ${res.length}`);
    fail();
  }
}
export async function patientList(repo: IInquiryRepository){
  let res = await repo.list({patientId: patient.id});
  if(res.length === 1){
    assert(compare(inquiry3, res[0]));
  }else{
    console.log(`patient1: ${res.length}`);
    fail();
  }
  res = await repo.list({patientId: patient2.id});
  if(res.length === 0){
    assert(true);
  }else{
    console.log(`patient2: ${res.length}`);
    fail();
  }
  res = await repo.list({patientId: patient6.id});
  if(res.length === 1){
    assert(compare(inquiry6, res[0]));
  }else{
    console.log(`patient3: ${res.length}`);
    fail();
  }
}
export async function facilityList(repo: IInquiryRepository){
  let res = await repo.list({facilityId: facility.id});
  if(res.length === 1){
    assert(compare(inquiry3, res[0]));
  }else{
    console.log(`facility1: ${res.length}`);
    fail();
  }
  res = await repo.list({facilityId: facility2.id});
  if(res.length === 2){
    for(const r of res){
      if(r.id === inquiry4.id) {
        assert(compare(inquiry4, r));
      }else if(r.id === inquiry6.id) {
        assert(compare(inquiry6, r));
      }
    }
  }else{
    console.log(`facility2: ${res.length}`);
    fail();
  }
  res = await repo.list({facilityId: "0003"});
  if(res.length === 0){
    assert(true);
  }else{
    console.log(`facility3: ${res.length}`);
    fail();
  }
}
export async function del(repo: IInquiryRepository){
  await repo.delete(inquiry3);
  let res = await repo.read(inquiry3.id);
  assertFalse(res);
  await repo.delete(inquiry4);
  res = await repo.read(inquiry4.id);
  assertFalse(res);
  await repo.delete(inquiry6);
  res = await repo.read(inquiry6.id);
  assertFalse(res);
}

export async function cleanUp(repoDue: IDueRepository, repoFac: IFacilityRepository,
    repoPat: IPatientRepository, repoUser: IUserRepository){
  await repoDue.delete(due);
  await repoDue.delete(due2);
  await repoFac.delete(facility);
  await repoFac.delete(facility2);
  await repoPat.delete(patient);
  await repoPat.delete(patient2);
  await repoPat.delete(patient6);
  await repoPat.delete(patientName);
  await repoUser.delete(user);
  await repoUser.delete(user2);
}