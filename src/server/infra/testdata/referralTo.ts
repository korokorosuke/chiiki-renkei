import { assert, assertFalse, fail } from "@std/assert"
import type { IReferralToRepository } from "../../domain/referraltoService.ts"
import type { ReferralTo } from "../../domain/referralto.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { IDepartmentRepository } from "../../domain/departmentService.ts"
import type { IDrRepository } from "../../domain/drService.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import type { IUserRepository } from "../../domain/userService.ts"
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

function compare(r1: ReferralTo, r2: ReferralTo): boolean {
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
  if(r1.patient && r2.patient){
    const p1 = r1.patient;
    const p2 = r2.patient;
    if(p1.id !== p2.id){
      console.log(`patient_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.lastName !== p2.lastName){
      console.log(`patient_lastname: ${p1.lastName} : ${p2.lastName}`);
      return false;
    }
    if(p1.firstName !== p2.firstName){
      console.log(`patient_firstname: ${p1.firstName} : ${p2.firstName}`);
      return false;
    }
  }
  if(r1.facility && r2.facility){
    const p1 = r1.facility;
    const p2 = r2.facility;
    if(p1.id !== p2.id){
      console.log(`facility_id: ${p1.id} : ${p2.id}`);
      return false;
    }
    if(p1.name !== p2.name){
      console.log(`facility_name: ${p1.name} : ${p2.name}`);
      return false;
    }
  }
  if(r1.facilityDr !== r2.facilityDr){
    console.log(`facilityDr: ${r1.facilityDr} : ${r2.facilityDr}`);
    return false;
  }
  if(r1.facilityDept && r2.facilityDept){
    if(r1.facilityDept !== r2.facilityDept){
      console.log(`facilityDept_id: ${r1.facilityDept} : ${r2.facilityDept}`);
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
  assert(res);
  res = await repo.insert(referralto2);
  assert(res);
}
export async function update(repo: IReferralToRepository){
  let res = await repo.update(referralto3);
  assert(res);
  res = await repo.update(referralto4);
  assert(res);
}
export async function read(repo: IReferralToRepository){
  let res = await repo.read(referralto3.id);
  if(res){
    assert(compare(referralto3, res));
  }else{
    fail();
  }
  res = await repo.read(referralto4.id);
  if(res){
    assert(compare(referralto4, res));
  }else{
    fail();
  }
}
export async function list(repo: IReferralToRepository){
  let res = await repo.list({fromDate:"2024-06-07", toDate: "2024-06-07"});
  if(res.length === 1){
    assert(compare(referralto3, res[0]));
  }else{
    console.log(res[0]);
    console.log(res[1]);
    console.log(`list1: ${res.length}`);
    fail();
  }
  res = await repo.list({fromDate:"2024-06-01"});
  if(res.length === 2){
    for(const r of res){
      if(appointment3.id === r.id){
        assert(compare(appointment3, r));
      }else if(appointment4.id === r.id){
        assert(compare(appointment4, r));
      }else{
        fail();
      }
    }
  }else{
    console.log(`list2: ${res.length}`);
    fail();
  }
}
export async function patientList(repo: IReferralToRepository){
  const res = await repo.list({patientId: referralto3.patient.id});
  if(res.length === 1){
    assert(compare(referralto3, res[0]));
  }else{
    console.log(`list1: ${res.length}`);
    fail();
  }
}
export async function del(repo: IReferralToRepository){
  await repo.delete(referralto3);
  let res = await repo.read(referralto3.id);
  assertFalse(res);
  await repo.delete(referralto2);
  res = await repo.read(referralto2.id);
  assertFalse(res);
}
export async function cleanUp(repoUser: IUserRepository, repoPat: IPatientRepository,
    repoDept: IDepartmentRepository, repoDr: IDrRepository, repoFac: IFacilityRepository) {
  await delFac(repoFac);
  await delPat(repoPat);
  await delDept(repoDept);
  await delDr(repoDr);
  await delUser(repoUser);
}