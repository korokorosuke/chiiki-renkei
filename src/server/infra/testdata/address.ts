import { assert, assertFalse, fail } from "@std/assert"
import type { IAddressRepository } from "../../domain/addressService.ts"
import type { Address } from "../../domain/address.ts"

export const address: Address = {
  postalCode: "1000001",
  name: "東京都千代田区猫町",
  plus: ""
}
export const address2: Address = {
  postalCode: "1000002",
  name: "東京都赤坂区犬町",
  plus: ""
}
export const address3: Address = {
  postalCode: "1000001",
  name: "東京都千代田区狐町",
  plus: ""
}
export const addressData: Address = {
  postalCode: "1000001",
  name: "東京都千代田区猫町",
  plus: "犬町５－１０－２"
}

function compare(u1: Address, u2: Address): boolean {
  if(u1.postalCode !== u2.postalCode){
    return false;
  }
  if(u1.name !== u2.name){
    return false;
  }
  return true;
}

export async function insert(repo: IAddressRepository){
  let res = await repo.insert(address);
  assert(res);
  res = await repo.insert(address2);
  assert(res);
}

export async function update(repo: IAddressRepository){
  const res = await repo.update(address3);
  assert(res);
}

export async function read(repo: IAddressRepository){
  let res = await repo.read(address.postalCode);
  if(res){
    assert(compare(address3, res));
  }else{
    fail();
  }
  res = await repo.read(address2.postalCode);
  if(res){
    assert(compare(address2, res));
  }else{
    fail();
  }
}

export async function del(repo: IAddressRepository){
  await repo.delete(address);
  let res = await repo.read(address.postalCode);
  assertFalse(res);
  await repo.delete(address2);
  res = await repo.read(address2.postalCode);
  assertFalse(res);
}