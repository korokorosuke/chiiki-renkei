import { expect } from "vitest"
import type { IReferralToRepository } from "../../domain/referraltoService.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { IDepartmentRepository } from "../../domain/departmentService.ts"
import type { IDrRepository } from "../../domain/drService.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { IUserRepository } from "../../domain/userService.ts"
import type { ReferralTo } from "../../domain/referralto.ts"
import { toReferralTo } from "../../lib/types.ts"
import { appointment, appointment2, appointment3, appointment4 } from "./appointment.ts"
import { insert as insertFac, del as delFac } from "./facility.ts"
import { insert as insertPat, del as delPat } from "./patient.ts"
import { insert as insertDept, del as delDept } from "./dept.ts"
import { insert as insertDr, del as delDr } from "./dr.ts"
import { insert as insertUser, del as delUser } from "./user.ts"

const referralto = toReferralTo(appointment);
const referralto2 = toReferralTo(appointment2);
const referralto3 = toReferralTo(appointment3);
const referralto4 = toReferralTo(appointment4);

function omitTimestamps(val: ReferralTo|undefined): Omit<ReferralTo, "updatedAt"|"updatedBy">|undefined {
  if(val){
    const {updatedAt, updatedBy, ...value} = val;
    return value;
  }else{
    return undefined;
  }
}

export async function prepare(repoUser: IUserRepository, repoPat: IPatientRepository,
    repoDept: IDepartmentRepository, repoDr: IDrRepository, repoFac: IFacilityRepository) {
  await insertFac(repoFac);
  await insertPat(repoPat);
  await insertDept(repoDept);
  await insertDr(repoDr);
  await insertUser(repoUser);
}
export async function insert(repo: IReferralToRepository){
  let res = await repo.insert(referralto);
  expect(res).toBe(true);
  res = await repo.insert(referralto2);
  expect(res).toBe(true);
}
export async function update(repo: IReferralToRepository){
  let res = await repo.update(referralto3);
  expect(res).toBe(true);
  res = await repo.update(referralto4);
  expect(res).toBe(true);
}
export async function read(repo: IReferralToRepository){
  let res = await repo.read(referralto3.id);
  expect(omitTimestamps(referralto3)).toEqual(omitTimestamps(res));
  res = await repo.read(referralto4.id);
  expect(omitTimestamps(referralto4)).toEqual(omitTimestamps(res));
}
export async function list(repo: IReferralToRepository){
  let res = await repo.list({fromDate:"2024-06-07", toDate: "2024-06-07"});
  if(res.length === 1){
    expect(omitTimestamps(referralto3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(res[0]);
    console.log(res[1]);
    console.log(`list1: ${res.length}`);
    expect.fail();
  }
  res = await repo.list({fromDate:"2024-06-01"});
  if(res.length === 2){
    for(const r of res){
      if(appointment3.id === r.id){
        expect(omitTimestamps(toReferralTo(appointment3))).toEqual(omitTimestamps(r));
      }else if(appointment4.id === r.id){
        expect(omitTimestamps(toReferralTo(appointment4))).toEqual(omitTimestamps(r));
      }else{
        expect.fail();
      }
    }
  }else{
    console.log(`list2: ${res.length}`);
    expect.fail();
  }
}
export async function patientList(repo: IReferralToRepository){
  const res = await repo.list({patientId: referralto3.patient.id});
  if(res.length === 1){
    expect(omitTimestamps(referralto3)).toEqual(omitTimestamps(res[0]));
  }else{
    console.log(`list1: ${res.length}`);
    expect.fail();
  }
}
export async function del(repo: IReferralToRepository){
  await repo.delete(referralto3);
  let res = await repo.read(referralto3.id);
  expect(res).toBeUndefined();
  await repo.delete(referralto2);
  res = await repo.read(referralto2.id);
  expect(res).toBeUndefined();
}
export async function cleanUp(repoUser: IUserRepository, repoPat: IPatientRepository,
    repoDept: IDepartmentRepository, repoDr: IDrRepository, repoFac: IFacilityRepository) {
  await delFac(repoFac);
  await delPat(repoPat);
  await delDept(repoDept);
  await delDr(repoDr);
  await delUser(repoUser);
}