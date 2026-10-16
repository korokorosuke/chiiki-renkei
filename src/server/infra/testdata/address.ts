import { expect } from "vitest"
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

export async function insert(repo: IAddressRepository){
  let res = await repo.insert(address);
  expect(res).toBe(true);
  res = await repo.insert(address2);
  expect(res).toBe(true);
}

export async function update(repo: IAddressRepository){
  const res = await repo.update(address3);
  expect(res).toBe(true);
}

export async function read(repo: IAddressRepository){
  let res = await repo.read(address.postalCode);
  expect(address3).toEqual(res);
  res = await repo.read(address2.postalCode);
  expect(address2).toEqual(res);
}

export async function del(repo: IAddressRepository){
  await repo.delete(address);
  let res = await repo.read(address.postalCode);
  expect(res).toBeUndefined();
  await repo.delete(address2);
  res = await repo.read(address2.postalCode);
  expect(res).toBeUndefined();
}