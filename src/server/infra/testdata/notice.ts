import { assert, assertFalse, fail } from "@std/assert"
import type { INoticeRepository } from "../../domain/noticeService.ts"
import { type Notice, NOTICE_TYPES } from "../../domain/notice.ts"

export const notice: Notice = {
  id: "00001",
  type: NOTICE_TYPES[0],
  message: "あああああああああ\nいいいいいいいいいいいいい\nうううううううううううう",
  fromDate: "2024-01-02",
  toDate: "2025-01-02"
}
export const notice2: Notice = {
  id: "00002",
  type: NOTICE_TYPES[0],
  message: "あああああああああ\nいいいいいいいいいいいいい\nうううううううううううう",
  fromDate: "2024-10-02",
  toDate: "2025-01-02"
}
export const notice3: Notice = {
  id: "00001",
  type: NOTICE_TYPES[1],
  message: "あああああああああ\nいいいいいいいいいいいいい\nうううううううううううう",
  fromDate: "2024-01-02",
  toDate: "2025-01-02"
}
export const notice4: Notice = {
  id: "00003",
  type: NOTICE_TYPES[0],
  message: "あああああああああ\nいいいいいいいいいいいいい\nうううううううううううう",
  fromDate: "2024-01-03",
  toDate: "2024-01-02"
}

function compare(u1: Notice, u2: Notice): boolean {
  if(u1.id !== u2.id){
    return false;
  }
  if(u1.type !== u2.type){
    return false;
  }
  if(u1.message !== u2.message){
    return false;
  }
  if(u1.fromDate !== u2.fromDate){
    return false;
  }
  if(u1.toDate !== u2.toDate){
    return false;
  }
  return true;
}

export async function insert(repo: INoticeRepository){
  let res = await repo.insert(notice);
  assert(res);
  res = await repo.insert(notice2);
  assert(res);
  res = await repo.insert(notice4);
  assert(res);
}
export async function update(repo: INoticeRepository){
  const res = await repo.update(notice3);
  assert(res);
}
export async function read(repo: INoticeRepository){
  let res = await repo.read(notice.id);
  if(res){
    assert(compare(notice3, res));
  }else{
    fail();
  }
  res = await repo.read(notice2.id);
  if(res){
    assert(compare(notice2, res));
  }else{
    fail();
  }
  res = await repo.read(notice4.id);
  if(res){
    assert(compare(notice4, res));
  }else{
    fail();
  }
}
export async function list(repo: INoticeRepository){
  const res = await repo.list("2024-08-01");
  if(res.length === 1){
    assert(compare(notice3, res[0]));
  }else{
    console.log(`list1: ${res.length}`);
    fail();
  }
  const res2 = await repo.list("2025-01-02");
  if(res2.length === 2){
    for(const r of res){
      if(notice3.id === r.id){
        assert(compare(notice3, r));
      }else if(notice2.id === r.id){
        assert(compare(notice2, r));
      }else{
        fail();
      }
    }
  }else{
    console.log(`list1: ${res.length}`);
    fail();
  }
}
export async function all(repo: INoticeRepository){
  const res = await repo.list();
  if(res.length === 3){
    for(const r of res){
      if(notice3.id === r.id){
        assert(compare(notice3, r));
      }else if(notice2.id === r.id){
        assert(compare(notice2, r));
      }else if(notice4.id === r.id){
        assert(compare(notice4, r));
      }else{
        fail();
      }
    }
  }else{
    console.log(`all: ${res.length}`);
    fail();
  }
}
export async function del(repo: INoticeRepository){
  await repo.delete(notice3);
  let res = await repo.read(notice3.id);
  assertFalse(res);
  await repo.delete(notice2);
  res = await repo.read(notice2.id);
  assertFalse(res);
  await repo.delete(notice4);
  res = await repo.read(notice4.id);
  assertFalse(res);
}