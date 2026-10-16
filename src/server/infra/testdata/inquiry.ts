import { expect } from "vitest"
import type { IInquiryRepository } from "../../domain/inquiryService.ts"
import type { IDueRepository } from "../../domain/dueService.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { IUserRepository } from "../../domain/userService.ts"
import type { Inquiry } from "../../domain/inquiry.ts"
import { user, user2, user_inquiry, toUser } from "./user.ts"
import { due, due2 } from "./due.ts"
import { facility, facility2, toFac } from "./facility.ts"
import { patient, patient2, patient6, patientName } from "./patient.ts"

export const inquiry: Inquiry = {
  id: "0001-00001",
  patient: patient,
  datetime: "2024-06-07T10:30",
  facility: toFac(facility),
  facilityStaff: "斎藤",
  personInCharge: {id: user.id, name: user.name, department: user.department},
  tel: "03-1234-5678",
  due: due,
  details: "といあわせがありました",
  done: true,
  responses: [{
    responder: toUser(user_inquiry),
    datetime: "2024-06-28T10:50",
    details: "連絡した",
  },{
    responder: toUser(user_inquiry),
    datetime: "2024-06-28T11:30",
    details: "連絡したよ",
  }]
}
export const inquiry2: Inquiry = {
  id: "0002-11111",
  patient: patient2,
  datetime: "2024-06-08T00:00",
  facility: toFac(facility2),
  facilityStaff: "院長",
  personInCharge: {id: user2.id, name: user2.name, department: user2.department},
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
  personInCharge: {id: user.id, name: user.name, department: user.department},
  tel: "03-1234-5678",
  due: due,
  details: "といあわせがありました",
  done: true,
  responses: [{
    responder: toUser(user_inquiry),
    datetime: "2024-06-28T10:50",
    details: "連絡した",
  },{
    responder: toUser(user_inquiry),
    datetime: "2024-06-28T11:30",
    details: "連絡したよ",
  },{
    responder: toUser(user_inquiry),
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
  personInCharge: {id: user2.id, name: user2.name, department: user2.department},
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
  personInCharge: {id: user2.id, name: user2.name, department: user2.department},
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
  personInCharge: {id: user2.id, name: user2.name, department: user2.department},
  tel: "03-1234-5678",
  due: due2,
  details: "といあわせがありました",
  done: false,
  responses: []
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
  await repoUser.insert(user_inquiry);
}

export async function insert(repo: IInquiryRepository){
  let res = await repo.insert(inquiry);
  expect(res).toBe(true);
  res = await repo.insert(inquiry2);
  expect(res).toBe(true);
  res = await repo.insert(inquiry5);
  expect(res).toBe(true);
}
export async function update(repo: IInquiryRepository){
  let res = await repo.update(inquiry3);
  expect(res).toBe(true);
  res = await repo.update(inquiry4);
  expect(res).toBe(true);
  res = await repo.update(inquiry6);
  expect(res).toBe(true);
}
export async function read(repo: IInquiryRepository){
  let res = await repo.read(inquiry3.id);
  expect(inquiry3).toEqual(res);
  res = await repo.read(inquiry4.id);
  expect(inquiry4).toEqual(res);
}
export async function list(repo: IInquiryRepository){
  let res = await repo.list({fromDate:"2024-06-07", toDate: "2024-06-07"});
  if(res.length === 1){
    expect(inquiry3).toEqual(res[0]);
  }else{
    console.log(`list1: ${res.length}`);
    expect.fail();
  }
  res = await repo.list({fromDate:"2024-06-01"});
  if(res.length === 3){
    for(const r of res){
      if(r.id === inquiry3.id) {
        expect(inquiry3).toEqual(r);
      }else if(r.id === inquiry4.id) {
        expect(inquiry4).toEqual(r);
      }else if(r.id === inquiry6.id) {
        expect(inquiry6).toEqual(r);
      }
    }
  }else{
    console.log(`list2: ${res.length}`);
    expect.fail();
  }
}
export async function patientList(repo: IInquiryRepository){
  let res = await repo.list({patientId: patient.id});
  if(res.length === 1){
    expect(inquiry3).toEqual(res[0]);
  }else{
    console.log(`patient1: ${res.length}`);
    expect.fail();
  }
  res = await repo.list({patientId: patient2.id});
  expect(res.length).toBe(0);
  res = await repo.list({patientId: patient6.id});
  if(res.length === 1){
    expect(inquiry6).toEqual(res[0]);
  }else{
    console.log(`patient3: ${res.length}`);
    expect.fail();
  }
}
export async function facilityList(repo: IInquiryRepository){
  let res = await repo.list({facilityId: facility.id});
  if(res.length === 1){
    expect(inquiry3).toEqual(res[0]);
  }else{
    console.log(`facility1: ${res.length}`);
    expect.fail();
  }
  res = await repo.list({facilityId: facility2.id});
  if(res.length === 2){
    for(const r of res){
      if(r.id === inquiry4.id) {
        expect(inquiry4).toEqual(r);
      }else if(r.id === inquiry6.id) {
        expect(inquiry6).toEqual(r);
      }
    }
  }else{
    console.log(`facility2: ${res.length}`);
    expect.fail();
  }
  res = await repo.list({facilityId: "0003"});
  expect(res.length).toBe(0);
}
export async function del(repo: IInquiryRepository){
  await repo.delete(inquiry3);
  let res = await repo.read(inquiry3.id);
  expect(res).toBeUndefined();
  await repo.delete(inquiry4);
  res = await repo.read(inquiry4.id);
  expect(res).toBeUndefined();
  await repo.delete(inquiry6);
  res = await repo.read(inquiry6.id);
  expect(res).toBeUndefined();
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
  await repoUser.delete(user_inquiry);
}