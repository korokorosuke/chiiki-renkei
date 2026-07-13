import { assert, assertFalse, fail } from "@std/assert"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { Patient } from "../../domain/patient.ts"
import { addressData } from "./address.ts"

export const patient: Patient = {
  id: "00000010",
  lastName: "患者",
  firstName: "太郎",
  lastKana: "かんじゃ",
  firstKana: "たろう",
  sex: 0,
  birthday: "1980-01-04",
  tel: "",
  tel2: "",
  address: addressData,
  memo: ""
}
export const patient2: Patient = {
  id: "00000020",
  lastName: "患者",
  firstName: "次郎",
  lastKana: "かんじゃ",
  firstKana: "じろう",
  sex: 0,
  birthday: "1985-02-14",
  tel: "",
  tel2: "",
  address: addressData,
  memo: ""
}
export const patient3: Patient = {
  id: "00000010",
  lastName: "患者",
  firstName: "三郎",
  lastKana: "かんじゃ",
  firstKana: "さぶろう",
  sex: 0,
  birthday: "1980-01-04",
  tel: "",
  tel2: "",
  address: addressData,
  memo: "クレーマー注意"
}
export const patient4: Patient = {
  id: "00000012",
  lastName: "患者",
  firstName: "史郎",
  lastKana: "かんじゃ",
  firstKana: "しろう",
  sex: 0,
  birthday: "1980-01-04",
  tel: "",
  tel2: "",
  address: addressData,
  memo: "クレーマー注意"
}
export const patient6: Patient = {
  id: "00000060",
  lastName: "患者",
  firstName: "六郎",
  lastKana: "かんじゃ",
  firstKana: "ろくろう",
  sex: 0,
  birthday: "1980-01-04",
  tel: "",
  tel2: "",
  address: addressData,
  memo: ""
}
export const patientNoId: Patient = {
  id: "",
  lastName: "患者",
  firstName: "五郎",
  lastKana: "かんじゃ",
  firstKana: "ごろう",
  sex: 0,
  birthday: "1980-01-04",
  tel: "",
  tel2: "",
  address: addressData,
  memo: "クレーマー注意"
}
export const patientName: Patient = {
  id: "患者　五郎",
  lastName: "",
  firstName: "",
  lastKana: "",
  firstKana: "",
  sex: 0,
  birthday: "",
  tel: "",
  tel2: "",
  address: {postalCode: "", name: "", plus: ""},
  memo: ""
}

function compare(u1: Patient, u2: Patient): boolean {
  if(u1.id !== u2.id){
    console.log(`id: ${u1.id} : ${u2.id}`);
    return false;
  }
  if(u1.lastName !== u2.lastName){
    console.log(`name: ${u1.lastName} : ${u2.lastName}`);
    return false;
  }
  if(u1.firstName !== u2.firstName){
    console.log(`name: ${u1.firstName} : ${u2.firstName}`);
    return false;
  }
  if(u1.lastKana !== u2.lastKana){
    console.log(`name: ${u1.lastKana} : ${u2.lastKana}`);
    return false;
  }
  if(u1.firstKana !== u2.firstKana){
    console.log(`name: ${u1.firstKana} : ${u2.firstKana}`);
    return false;
  }
  if(u1.sex !== u2.sex){
    console.log(`sex: ${u1.sex} : ${u2.sex}`);
    return false;
  }
  if(u1.birthday !== u2.birthday){
    console.log(`birthday: ${u1.birthday} : ${u2.birthday}`);
    return false;
  }
  if(u1.tel !== u2.tel){
    console.log(`tel: ${u1.tel} : ${u2.tel}`);
    return false;
  }
  if(u1.address.postalCode !== u2.address.postalCode){
    console.log(`postalCode: ${u1.address.postalCode} : ${u2.address.postalCode}`);
    return false;
  }
  if(u1.address.plus !== u2.address.plus){
    console.log(`plus: ${u1.address.plus} : ${u2.address.plus}`);
    return false;
  }
  if(u1.memo !== u2.memo){
    console.log(`memo: ${u1.memo} : ${u2.memo}`);
    return false;
  }
  return true;
}

export async function insert(repo: IPatientRepository){
  let res = await repo.insert(patient);
  assert(res);
  res = await repo.insert(patient2);
  assert(res);
}
export async function update(repo: IPatientRepository){
  const res = await repo.update(patient3);
  assert(res);
}
export async function read(repo: IPatientRepository){
  let res = await repo.read(patient.id);
  if(res){
    assert(compare(patient3, res));
  }else{
    fail();
  }
  res = await repo.read(patient2.id);
  if(res){
    assert(compare(patient2, res));
  }else{
    fail();
  }
}
export async function list(repo: IPatientRepository){
  const res = await repo.list({name: patient3.firstName});
  if(res.length === 1){
    assert(compare(patient3, res[0]));
  }else{
    console.log(res.length);
    fail();
  }
}
export async function del(repo: IPatientRepository){
  await repo.delete(patient);
  let res = await repo.read(patient.id);
  assertFalse(res);
  await repo.delete(patient2);
  res = await repo.read(patient2.id);
  assertFalse(res);
}