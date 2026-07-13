import { assert, assertFalse, fail } from "@std/assert"
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

function compare(u1: WebReservation, u2: WebReservation): boolean {
  if(u1.dept !== u2.dept){
    return false;
  }
  if(u1.dr !== u2.dr){
    return false;
  }
  if(u1.date !== u2.date){
    return false;
  }
  if(u1.time !== u2.time){
    return false;
  }
  if(u1.max !== u2.max){
    return false;
  }
  if(u1.cnt !== u2.cnt){
    return false;
  }
  return true;
}

export async function insert(repo: IWebReservationRepository){
  let res = await repo.insert(reservation);
  assert(res);
  res = await repo.insert(reservation2);
  assert(res);
  res = await repo.insert(reservation4);
  assert(res);
  res = await repo.insert(reservation5);
  assert(res);
}
export async function update(repo: IWebReservationRepository){
  const res = await repo.update(reservation3);
  assert(res);
}
export async function read(repo: IWebReservationRepository){
  let res = await repo.read(reservation3.dept, reservation3.dr, reservation3.date, reservation3.time);
  if(res){
    assert(compare(reservation3, res));
  }else{
    fail();
  }
  res = await repo.read(reservation2.dept, reservation2.dr, reservation2.date, reservation2.time);
  if(res){
    assert(compare(reservation2, res));
  }else{
    fail();
  }
}
export async function list(repo: IWebReservationRepository){
  let res = await repo.listByDate("02", "2024-08");
  if(res.length === 2){
    assert(compare(reservation2, res[0]));
    assert(compare(reservation4, res[1]));
  }else{
    console.log(`list1: ${res.length}`);
    fail();
  }
  res = await repo.listByDate("01", "2024-08");
  if(res.length === 1){
    assert(compare(reservation3, res[0]));
  }else{
    console.log(res);
    console.log(`list2: ${res.length}`);
    fail();
  }
}
export async function del(repo: IWebReservationRepository){
  await repo.delete(reservation3);
  let res = await repo.read(reservation3.dept, reservation3.dr, reservation3.date, reservation3.time);
  assertFalse(res);
  await repo.delete(reservation2);
  res = await repo.read(reservation2.dept, reservation2.dr, reservation2.date, reservation2.time);
  assertFalse(res);
  await repo.delete(reservation4);
  res = await repo.read(reservation4.dept, reservation4.dr, reservation4.date, reservation4.time);
  assertFalse(res);
  await repo.delete(reservation5);
  res = await repo.read(reservation5.dept, reservation5.dr, reservation5.date, reservation5.time);
  assertFalse(res);
}