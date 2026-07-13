import { assert, assertFalse, fail } from "@std/assert"
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
  createdBy: user,
  createdAt: "2020-10-21T00:00:00Z",
  updatedBy: user2,
  updatedAt: "2023-11-01T00:00:00Z",
}

function compare(u1: Facility, u2: Facility): boolean {
  if(u1.id !== u2.id){
    console.log(`id: ${u1.id} : ${u2.id}`);
    return false;
  }
  if(u1.name !== u2.name){
    console.log(`name: ${u1.name} : ${u2.name}`);
    return false;
  }
  if(u1.nameCorp !== u2.nameCorp){
    console.log(`nameCorp: ${u1.nameCorp} : ${u2.nameCorp}`);
    return false;
  }
  if(u1.kana !== u2.kana){
    console.log(`kana: ${u1.kana} : ${u2.kana}`);
    return false;
  }
  if(u1.tel !== u2.tel){
    console.log(`tel: ${u1.tel} : ${u2.tel}`);
    return false;
  }
  if(u1.fax !== u2.fax){
    console.log(`fax: ${u1.fax} : ${u2.fax}`);
    return false;
  }
  if(u1.email !== u2.email){
    console.log(`email: ${u1.email} : ${u2.email}`);
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
  if(u1.closedDate !== u2.closedDate){
    console.log(`closedDate: ${u1.closedDate} : ${u2.closedDate}`);
    return false;
  }
  if(u1.contacts.length !== u2.contacts.length){
    console.log(`contacts: ${u1.contacts.length} : ${u2.contacts.length}`);
    return false;
  }
  for(let i = 0; i < u1.contacts.length; i++){
    const c1 = u1.contacts[i];
    const c2 = u2.contacts[i];
    if(c1.tel !== c2.tel){
      console.log(`tel: ${i} : ${c1.tel} : ${c2.tel}`);
      return false;
    }
    if(c1.fax !== c2.fax){
      console.log(`fax: ${i} : ${c1.fax} : ${c2.fax}`);
      return false;
    }
    if(c1.email !== c2.email){
      console.log(`email: ${i} : ${c1.tel} : ${c2.tel}`);
      return false;
    }
    if(c1.name !== c2.name){
      console.log(`name: ${i} : ${c1.name} : ${c2.name}`);
      return false;
    }
  }
  return true;
}

export async function insert(repo: IFacilityRepository){
  let res = await repo.insert(facility);
  assert(res);
  res = await repo.insert(facility2);
  assert(res);
  res = await repo.insert(facility4);
  assert(res);
}
export async function update(repo: IFacilityRepository){
  const res = await repo.update(facility3);
  assert(res);
}
export async function read(repo: IFacilityRepository){
  let res = await repo.read(facility.id);
  if(res){
    assert(compare(facility3, res));
  }else{
    fail();
  }
  res = await repo.read(facility2.id);
  if(res){
    assert(compare(facility2, res));
  }else{
    fail();
  }
}
export async function list(repo: IFacilityRepository){
  let res = await repo.list("たこやき");
  if(res.length === 1){
    assert(compare(facility3, res[0]));
  }else{
    console.log(`list1: ${res.length}`);
    fail();
  }
  res = await repo.list("病院");
  if(res.length === 2){
    assert(compare(facility3, res[0]));
    assert(compare(facility2, res[1]));
  }else{
    console.log(`list2: ${res.length}`);
    fail();
  }
}
export async function del(repo: IFacilityRepository){
  await repo.delete(facility);
  let res = await repo.read(facility.id);
  assertFalse(res);
  await repo.delete(facility2);
  res = await repo.read(facility2.id);
  assertFalse(res);
  await repo.delete(facility4);
  res = await repo.read(facility4.id);
  assertFalse(res);
}