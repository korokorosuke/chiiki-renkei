import { expect } from "vitest"
import type { IAppointmentRepository } from "../../domain/appointmentService.ts"
import type { IReplyRepository } from "../../domain/replyService.ts"
import type { Reply } from "../../domain/reply.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { IDepartmentRepository } from "../../domain/departmentService.ts"
import type { IDrRepository } from "../../domain/drService.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { IUserRepository } from "../../domain/userService.ts"
import type { IClassificationRepository } from "../../domain/classificationService.ts"
import { user } from "./user.ts"
import { dr } from "./dr.ts"
import { department, department2 } from "./dept.ts"
import { appointment, appointment2, appointment3 } from "./appointment.ts"
import { classification1, classification2 } from "./classification.ts"
import { toUser } from "../../lib/types.ts"
import { insert as insertFac, del as delFac } from "./facility.ts"
import { insert as insertPat, del as delPat } from "./patient.ts"
import { insert as insertDept, del as delDept } from "./dept.ts"
import { insert as insertDr, del as delDr } from "./dr.ts"
import { insert as insertUser, del as delUser } from "./user.ts"
import { insert as insertCls, del as delCls } from "./classification.ts"

export const referral = appointment;
export const referral2 = appointment2;
export const referral3 = appointment3;
referral3.id = "3";
referral3.date = "2024-06-10";

export const reply: Reply = {
  id: "1-1",
  refId: referral.id,
  date: "2024-06-07",
  department: {id: department.id, name: department.name},
  dr: dr,
  classification: classification1,
  personInCharge: toUser(user),
  memo: "",
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T12:34:56Z",
}
export const reply2: Reply = {
  id: "2-1",
  refId: referral2.id,
  date: "2024-06-08",
  department: {id: department2.id, name: department2.name},
  dr: dr,
  classification: classification1,
  personInCharge: toUser(user),
  memo: "",
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T12:34:56Z",
}
export const reply3: Reply = {
  id: "1-2",
  refId: referral.id,
  date: "2024-06-14",
  department: {id: department.id, name: department.name},
  dr: dr,
  classification: classification2,
  personInCharge: toUser(user),
  memo: "",
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T12:34:56Z",
}
export const reply4: Reply = {
  id: "1-2",
  refId: referral.id,
  date: "2024-06-15",
  department: {id: department.id, name: department.name},
  dr: dr,
  classification: classification1,
  personInCharge: toUser(user),
  memo: "メモを目盛った",
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T12:34:56Z",
}

function omitTimestamps(val: Reply|undefined): Omit<Reply, "updatedAt">|undefined {
  if(val){
    const {updatedAt, ...value} = val;
    return value;
  }else{
    return undefined;
  }
}

export async function prepare(repoApp: IAppointmentRepository,
    repoUser?: IUserRepository, repoPat?: IPatientRepository,
    repoDept?: IDepartmentRepository, repoDr?: IDrRepository,
    repoFac?: IFacilityRepository, repoCls?: IClassificationRepository) {
  if(repoFac){
    await insertFac(repoFac);
  }
  if(repoPat){
    await insertPat(repoPat);
  }
  if(repoDept){
    await insertDept(repoDept);
  }
  if(repoDr){
    await insertDr(repoDr);
  }
  if(repoUser){
    await insertUser(repoUser);
  }
  if(repoCls){
    await insertCls(repoCls);
  }
  await repoApp.insert(referral);
  await repoApp.insert(referral2);
  await repoApp.insert(referral3);
}
export async function insert(repo: IReplyRepository){
  let res = await repo.insert(reply);
  expect(res).toBe(true);
  res = await repo.insert(reply2);
  expect(res).toBe(true);
  res = await repo.insert(reply3);
  expect(res).toBe(true);
}
export async function update(repo: IReplyRepository){
  const res = await repo.update(reply4);
  expect(res).toBe(true);
}
export async function read(repo: IReplyRepository){
  let res = await repo.read(reply.id);
  if(res){
    expect(omitTimestamps(reply)).toEqual(omitTimestamps(res.replies[0]));
  }else{
    expect.fail();
  }
  res = await repo.read(reply2.id);
  if(res){
    expect(omitTimestamps(reply2)).toEqual(omitTimestamps(res.replies[0]));
  }else{
    expect.fail();
  }
  res = await repo.read(reply4.id);
  if(res){
    expect(omitTimestamps(reply4)).toEqual(omitTimestamps(res.replies[0]));
  }else{
    expect.fail();
  }
}
export async function list(repo: IReplyRepository){
  const res = await repo.list({ fromDate: "2024-06-07", toDate: "2024-06-15"});
  if(res.length === 3){
    for(const ref of res){
      for(const rep of ref.replies){
        if(rep.id === reply.id){
          expect(omitTimestamps(reply)).toEqual(omitTimestamps(rep));
        }else if(rep.id === reply2.id){
          expect(omitTimestamps(reply2)).toEqual(omitTimestamps(rep));
        }else if(rep.id === reply4.id){
          expect(omitTimestamps(reply4)).toEqual(omitTimestamps(rep));
        }else{
          expect(ref.id === referral3.id);
        }
      }
    }
  }else{
    for(const rep of res){
      console.log(rep);
    }
    console.log(`list1: ${res.length}`);
    expect.fail();
  }
}
export async function del(repo: IReplyRepository, repoApp: IAppointmentRepository){
  await repoApp.delete(referral);
  let res = await repoApp.read(referral.id);
  expect(res).toBeUndefined();
  await repoApp.delete(referral3);
  res = await repoApp.read(referral3.id);
  expect(res).toBeUndefined();
  await repoApp.delete(referral2);
  res = await repoApp.read(referral2.id);
  expect(res).toBeUndefined();
  await repo.delete(reply);
  let res2 = await repo.read(reply.id);
  expect(res2).toBeUndefined();
  await repo.delete(reply2);
  res2 = await repo.read(reply2.id);
  expect(res2).toBeUndefined();
  await repo.delete(reply4);
  res2 = await repo.read(reply4.id);
  expect(res2).toBeUndefined();
}
export async function cleanUp(repoUser: IUserRepository, repoPat: IPatientRepository,
    repoDept: IDepartmentRepository, repoDr: IDrRepository, repoFac: IFacilityRepository,
    repoCls: IClassificationRepository) {
  await delFac(repoFac);
  await delPat(repoPat);
  await delDept(repoDept);
  await delDr(repoDr);
  await delUser(repoUser);
  await delCls(repoCls);
}