import { expect } from "vitest"
import type { IWebNoticeRepository } from "../../domain/webNoticeService.ts"
import { type WebNotice, NOTICE_PAGES } from "../../domain/webNotice.ts"

export const notice: WebNotice = {
  id: "00001",
  page: NOTICE_PAGES[0],
  message: "あああああああああ\nいいいいいいいいいいいいい\nうううううううううううう",
  fromDate: "2024-01-02",
  toDate: "2025-01-02",
  importance: false
}
export const notice2: WebNotice = {
  id: "00002",
  page: NOTICE_PAGES[0],
  message: "あああああああああ\nいいいいいいいいいいいいい\nうううううううううううう",
  fromDate: "2024-10-02",
  toDate: "2025-01-02",
  importance: false
}
export const notice3: WebNotice = {
  id: "00001",
  page: NOTICE_PAGES[1],
  message: "あああああああああ\nいいいいいいいいいいいいい\nうううううううううううう",
  fromDate: "2024-01-02",
  toDate: "2025-01-02",
  importance: false
}
export const notice4: WebNotice = {
  id: "00003",
  page: NOTICE_PAGES[0],
  message: "あああああああああ\nいいいいいいいいいいいいい\nうううううううううううう",
  fromDate: "2024-01-03",
  toDate: "2024-01-02",
  importance: false
}

export async function insert(repo: IWebNoticeRepository){
  let res = await repo.insert(notice);
  expect(res).toBe(true);
  res = await repo.insert(notice2);
  expect(res).toBe(true);
  res = await repo.insert(notice4);
  expect(res).toBe(true);
}
export async function update(repo: IWebNoticeRepository){
  const res = await repo.update(notice3);
  expect(res).toBe(true);
}
export async function read(repo: IWebNoticeRepository){
  let res = await repo.read(notice.id);
  expect(notice3).toEqual(res);
  res = await repo.read(notice2.id);
  expect(notice2).toEqual(res);
  res = await repo.read(notice4.id);
  expect(notice4).toEqual(res);
}
export async function list(repo: IWebNoticeRepository){
  const res = await repo.list(NOTICE_PAGES[1], "2024-08-01");
  if(res.length === 1){
    expect(notice3).toEqual(res[0]);
  }else{
    console.log(`list: ${res.length}`);
    expect.fail();
  }
  const res2 = await repo.list(NOTICE_PAGES[0], "2025-01-02");
  if(res2.length === 1){
    expect(notice2).toEqual(res2[0]);
  }else{
    console.log(`list1: ${res.length}`);
    expect.fail();
  }
}
export async function all(repo: IWebNoticeRepository){
  const res = await repo.all();
  if(res.length === 3){
    for(const r of res){
      if(notice3.id === r.id){
        expect(notice3).toEqual(r);
      }else if(notice2.id === r.id){
        expect(notice2).toEqual(r);
      }else if(notice4.id === r.id){
        expect(notice4).toEqual(r);
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`all: ${res.length}`);
    expect.fail();
  }
}
export async function del(repo: IWebNoticeRepository){
  await repo.delete(notice3);
  let res = await repo.read(notice3.id);
  expect(res).toBeUndefined();
  await repo.delete(notice2);
  res = await repo.read(notice2.id);
  expect(res).toBeUndefined();
  await repo.delete(notice4);
  res = await repo.read(notice4.id);
  expect(res).toBeUndefined();
}