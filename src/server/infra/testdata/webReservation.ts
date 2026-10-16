import { expect } from "vitest"
import type { IWebReservationRepository } from "../../domain/webReservationService.ts"
import type { WebReservation } from "../../domain/webReservation.ts"

export const reservation: WebReservation = {
  dept: "01",
  dr: "0001",
  date: "2024-08-01",
  time: "09:00",
  max: 3,
  cnt: 0
}
export const reservation2: WebReservation = {
  dept: "02",
  dr: "0001",
  date: "2024-08-01",
  time: "10:30",
  max: 3,
  cnt: 0
}
export const reservation3: WebReservation = {
  dept: "01",
  dr: "0001",
  date: "2024-08-01",
  time: "09:00",
  max: 3,
  cnt: 1
}
export const reservation4: WebReservation = {
  dept: "02",
  dr: "0001",
  date: "2024-08-21",
  time: "09:00",
  max: 3,
  cnt: 0
}
export const reservation5: WebReservation = {
  dept: "01",
  dr: "0001",
  date: "2024-09-01",
  time: "09:00",
  max: 3,
  cnt: 0
}

export async function insert(repo: IWebReservationRepository){
  let res = await repo.insert(reservation);
  expect(res).toBe(true);
  res = await repo.insert(reservation2);
  expect(res).toBe(true);
  res = await repo.insert(reservation4);
  expect(res).toBe(true);
  res = await repo.insert(reservation5);
  expect(res).toBe(true);
}
export async function update(repo: IWebReservationRepository){
  const res = await repo.update(reservation3);
  expect(res).toBe(true);
}
export async function read(repo: IWebReservationRepository){
  let res = await repo.read(reservation3.dept, reservation3.dr, reservation3.date, reservation3.time);
  expect(reservation3).toEqual(res);
  res = await repo.read(reservation2.dept, reservation2.dr, reservation2.date, reservation2.time);
  expect(reservation2).toEqual(res);
}
export async function list(repo: IWebReservationRepository){
  let res = await repo.listByDate("02", "2024-08");
  if(res.length === 2){
    expect(reservation2).toEqual(res[0]);
    expect(reservation4).toEqual(res[1]);
  }else{
    console.log(`list1: ${res.length}`);
    expect.fail();
  }
  res = await repo.listByDate("01", "2024-08");
  if(res.length === 1){
    expect(reservation3).toEqual(res[0]);
  }else{
    console.log(res);
    console.log(`list2: ${res.length}`);
    expect.fail();
  }
}
export async function del(repo: IWebReservationRepository){
  await repo.delete(reservation3);
  let res = await repo.read(reservation3.dept, reservation3.dr, reservation3.date, reservation3.time);
  expect(res).toBeUndefined();
  await repo.delete(reservation2);
  res = await repo.read(reservation2.dept, reservation2.dr, reservation2.date, reservation2.time);
  expect(res).toBeUndefined();
  await repo.delete(reservation4);
  res = await repo.read(reservation4.dept, reservation4.dr, reservation4.date, reservation4.time);
  expect(res).toBeUndefined();
  await repo.delete(reservation5);
  res = await repo.read(reservation5.dept, reservation5.dr, reservation5.date, reservation5.time);
  expect(res).toBeUndefined();
}