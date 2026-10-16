import { expect } from "vitest"
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

export async function insert(repo: IPatientRepository){
  let res = await repo.insert(patient);
  expect(res).toBe(true);
  res = await repo.insert(patient2);
  expect(res).toBe(true);
}
export async function update(repo: IPatientRepository){
  const res = await repo.update(patient3);
  expect(res).toBe(true);
}
export async function read(repo: IPatientRepository){
  let res = await repo.read(patient.id);
  expect(patient3).toEqual(res);
  res = await repo.read(patient2.id);
  expect(patient2).toEqual(res);
}
export async function list(repo: IPatientRepository){
  const res = await repo.list({name: patient3.firstName});
  if(res.length === 1){
    expect(patient3).toEqual(res[0]);
  }else{
    console.log(res.length);
    expect.fail();
  }
}
export async function del(repo: IPatientRepository){
  await repo.delete(patient);
  let res = await repo.read(patient.id);
  expect(res).toBeUndefined();
  await repo.delete(patient2);
  res = await repo.read(patient2.id);
  expect(res).toBeUndefined();
}