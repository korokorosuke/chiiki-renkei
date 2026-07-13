import { assert, assertFalse, fail } from "@std/assert"
import type { IAppointmentRepository } from "../../domain/appointmentService.ts"
import type { IReplyRepository } from "../../domain/replyService.ts"
import type { Reply } from "../../domain/reply.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { IDepartmentRepository } from "../../domain/departmentService.ts"
import type { IDrRepository } from "../../domain/drService.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { IUserRepository } from "../../domain/userService.ts"
import { user } from "./user.ts"
import { dr } from "./dr.ts"
import { department, department2 } from "./dept.ts"
import { appointment, appointment2, appointment3 } from "./appointment.ts"
import { toUser } from "../../lib/types.ts"
import { insert as insertFac, del as delFac } from "./facility.ts"
import { insert as insertPat, del as delPat } from "./patient.ts"
import { insert as insertDept, del as delDept } from "./dept.ts"
import { insert as insertDr, del as delDr } from "./dr.ts"
import { insert as insertUser, del as delUser } from "./user.ts"

export const referral = appointment;
export const referral2 = appointment2;
export const referral3 = appointment3;
referral3.id = "3";
referral3.date = "2024-06-10";

export const reply: Reply = {
  id: "1-1",
  refId: referral.id,
  date: "2024-06-07",
  department: department,
  dr: dr,
  classification: "1",
  personInCharge: toUser(user),
  memo: "",
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T12:34:56Z",
}
export const reply2: Reply = {
  id: "2-1",
  refId: referral2.id,
  date: "2024-06-08",
  department: department2,
  dr: dr,
  classification: "2",
  personInCharge: toUser(user),
  memo: "",
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T12:34:56Z",
}
export const reply3: Reply = {
  id: "1-2",
  refId: referral.id,
  date: "2024-06-14",
  department: department,
  dr: dr,
  classification: "3",
  personInCharge: toUser(user),
  memo: "",
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T12:34:56Z",
}
export const reply4: Reply = {
  id: "1-2",
  refId: referral.id,
  date: "2024-06-15",
  department: department,
  dr: dr,
  classification: "4",
  personInCharge: toUser(user),
  memo: "メモを目盛った",
  updatedBy: toUser(user),
  updatedAt: "2024-06-07T12:34:56Z",
}

function compare(r1: Reply, r2: Reply): boolean {
  if(r1.id !== r2.id){
    console.log(`id: ${r1.id} : ${r2.id}`);
    return false;
  }
  if(r1.date !== r2.date){
    console.log(`date: ${r1.date} : ${r2.date}`);
    return false;
  }
  if(r1.memo !== r2.memo){
    console.log(`memo: ${r1.memo} : ${r2.memo}`);
    return false;
  }
  if(r1.personInCharge && r2.personInCharge){
    const p1 = r1.personInCharge;
    const p2 = r2.personInCharge;
    if(p1.id !== p2.id){
      console.log(`personInCharge_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.name !== p2.name){
      console.log(`personInCharge_name: ${p1.name} : ${p2.name}`);
      return false;
    }
  }
  if(r1.department && r2.department){
    const p1 = r1.department;
    const p2 = r2.department;
    if(p1.id !== p2.id){
      console.log(`department_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.name !== p2.name){
      console.log(`department_name: ${p1.name} : ${p2.name}`);
      return false;
    }
  }
  if(r1.dr && r2.dr){
    const p1 = r1.dr;
    const p2 = r2.dr;
    if(p1.id !== p2.id){
      console.log(`dr_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.name !== p2.name){
      console.log(`dr_name: ${p1.name} : ${p2.name}`);
      return false;
    }
  }
  return true;
}

export async function prepare(repoApp: IAppointmentRepository,
    repoUser?: IUserRepository, repoPat?: IPatientRepository,
    repoDept?: IDepartmentRepository, repoDr?: IDrRepository, repoFac?: IFacilityRepository) {
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
  await repoApp.insert(referral);
  await repoApp.insert(referral2);
  await repoApp.insert(referral3);
}
export async function insert(repo: IReplyRepository){
  let res = await repo.insert(reply);
  assert(res);
  res = await repo.insert(reply2);
  assert(res);
  res = await repo.insert(reply3);
  assert(res);
}
export async function update(repo: IReplyRepository){
  const res = await repo.update(reply4);
  assert(res);
}
export async function read(repo: IReplyRepository){
  let res = await repo.read(reply.id);
  if(res){
    assert(compare(reply, res.replies[0]));
  }else{
    fail();
  }
  res = await repo.read(reply2.id);
  if(res){
    assert(compare(reply2, res.replies[0]));
  }else{
    fail();
  }
  res = await repo.read(reply4.id);
  if(res){
    assert(compare(reply4, res.replies[0]));
  }else{
    fail();
  }
}
export async function list(repo: IReplyRepository){
  const res = await repo.list({ fromDate: "2024-06-07", toDate: "2024-06-15"});
  if(res.length === 3){
    for(const ref of res){
      for(const rep of ref.replies){
        if(rep.id === reply.id){
          assert(compare(reply, rep));
        }else if(rep.id === reply2.id){
          assert(compare(reply2, rep));
        }else if(rep.id === reply4.id){
          assert(compare(reply4, rep));
        }else{
          assert(ref.id === referral3.id);
        }
      }
    }
  }else{
    for(const rep of res){
      console.log(rep);
    }
    console.log(`list1: ${res.length}`);
    fail();
  }
}
export async function del(repo: IReplyRepository, repoApp: IAppointmentRepository){
  await repoApp.delete(referral);
  let res = await repoApp.read(referral.id);
  assertFalse(res);
  await repoApp.delete(referral3);
  res = await repoApp.read(referral3.id);
  assertFalse(res);
  await repoApp.delete(referral2);
  res = await repoApp.read(referral2.id);
  assertFalse(res);
  await repo.delete(reply);
  let res2 = await repo.read(reply.id);
  assertFalse(res2);
  await repo.delete(reply2);
  res2 = await repo.read(reply2.id);
  assertFalse(res2);
  await repo.delete(reply4);
  res2 = await repo.read(reply4.id);
  assertFalse(res2);
}
export async function cleanUp(repoUser: IUserRepository, repoPat: IPatientRepository,
    repoDept: IDepartmentRepository, repoDr: IDrRepository, repoFac: IFacilityRepository) {
  await delFac(repoFac);
  await delPat(repoPat);
  await delDept(repoDept);
  await delDr(repoDr);
  await delUser(repoUser);
}