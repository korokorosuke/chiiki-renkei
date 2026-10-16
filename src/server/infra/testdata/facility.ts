import { expect } from "vitest"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { Facility, Contact } from "../../domain/facility.ts"
import { addressData } from "./address.ts"
import { user, user2 } from "./user.ts"
export { toFac } from "../../lib/types.ts"

export const facility: Facility = {
  id: "0001",
  attribute: "病院",
  nameCorp: "医療法人　たこやき会",
  name: "たこやき病院",
  kana: "たこやきびょういん",
  tel: "086-422-1234",
  fax: "086-422-5678",
  email: "email@example.com",
  contacts: [],
  address: addressData,
  memo: "今日もいいことはなかった。\r\nもう疲れた",
  closedDate: "",
  faxSendNo: "123-456-7890",
  notSend: false,
  createdBy: user,
  createdAt: "2020-10-21T00:00:00Z",
  updatedBy: user,
  updatedAt: "2023-10-31T00:00:00Z",
}
export const facility2: Facility = {
  id: "0002",
  attribute: "病院",
  nameCorp: "医療法人　いかやき会",
  name: "いかやき病院",
  kana: "いかやきびょういん",
  tel: "086-422-1234",
  fax: "086-422-5678",
  email: "email@example.com",
  contacts: [],
  address: addressData,
  memo: "今日もいいことはなかった。\r\nもう疲れた",
  closedDate: "",
  faxSendNo: "",
  notSend: true,
  createdBy: user,
  createdAt: "2020-10-21T00:00:00Z",
  updatedBy: user,
  updatedAt: "2023-10-31T00:00:00Z",
}
const contact: Contact = {
  tel: "123-456-789",
  fax: "",
  email: "",
  name: "地域連携室",
}
export const facility3: Facility = {
  id: "0001",
  attribute: "病院",
  nameCorp: "医療法人　たこやき会",
  name: "たこやき病院",
  kana: "たこやきびょういん",
  tel: "086-422-1234",
  fax: "086-422-5678",
  email: "email@example.com",
  contacts: [contact],
  address: addressData,
  memo: "今日もいいことはなかった。\r\nもう疲れた\r\n今日はいいことがあった。\r\nがんばれそうだ",
  closedDate: "",
  faxSendNo: "",
  notSend: false,
  createdBy: user,
  createdAt: "2020-10-21T00:00:00Z",
  updatedBy: user2,
  updatedAt: "2023-11-01T00:00:00Z",
}
const contact2: Contact = {
  tel: "789-456-123",
  fax: "444-555-666",
  email: "kome@kome.com",
  name: "医療相談室",
}
export const facility4: Facility = {
  id: "0005",
  attribute: "",
  nameCorp: "",
  name: "いかやき美容院",
  kana: "いかやきびよういん",
  tel: "086-422-1234",
  fax: "086-422-5678",
  email: "email@example.com",
  contacts: [contact, contact2],
  address: addressData,
  memo: "めもめも",
  closedDate: "2026-12-23",
  faxSendNo: "",
  notSend: false,
  createdBy: user,
  createdAt: "2020-10-21T00:00:00Z",
  updatedBy: user2,
  updatedAt: "2023-11-01T00:00:00Z",
}

function omitTimestamps(val: Facility|undefined): Omit<Facility, "updatedAt"|"updatedBy"|"createdAt"|"createdBy">|undefined {
  if(val){
    const {createdAt, createdBy, updatedAt, updatedBy, ...value} = val;
    return value;
  }
  return undefined;
}

export async function insert(repo: IFacilityRepository){
  let res = await repo.insert(facility);
  expect(res).toBe(true);
  res = await repo.insert(facility2);
  expect(res).toBe(true);
  res = await repo.insert(facility4);
  expect(res).toBe(true);
}
export async function update(repo: IFacilityRepository){
  const res = await repo.update(facility3);
  expect(res).toBe(true);
}
export async function read(repo: IFacilityRepository){
  let res = await repo.read(facility.id);
  expect(omitTimestamps(facility3)).toEqual(omitTimestamps(res));
  res = await repo.read(facility2.id);
  expect(omitTimestamps(facility2)).toEqual(omitTimestamps(res));
}
export async function list(repo: IFacilityRepository){
  let res = await repo.list("たこやき");
  if(res.length === 1){
    expect(omitTimestamps(facility3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`list1: ${res.length}`);
    expect.fail();
  }
  res = await repo.list("病院");
  if(res.length === 2){
    for(const r of res){
      if(r.id === facility3.id) {
        expect(omitTimestamps(facility3)).toEqual(omitTimestamps(r));
      }else if(r.id === facility2.id) {
        expect(omitTimestamps(facility2)).toEqual(omitTimestamps(r));
      }
    }
  }else{
    console.log(`list2: ${res.length}`);
    expect.fail();
  }
}
export async function del(repo: IFacilityRepository){
  await repo.delete(facility);
  let res = await repo.read(facility.id);
  expect(res).toBeUndefined();
  await repo.delete(facility2);
  res = await repo.read(facility2.id);
  expect(res).toBeUndefined();
  await repo.delete(facility4);
  res = await repo.read(facility4.id);
  expect(res).toBeUndefined();
}