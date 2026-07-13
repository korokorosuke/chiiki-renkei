import { assert, assertFalse, fail } from "@std/assert"
import { ReferralToRepository } from "../infra/referraltoRepository.ts"
import { ReferralToService } from "./referraltoService.ts"
import type { ReferralTo } from "./referralto.ts"
import { toReferralTo } from "../lib/types.ts"
import { appointment, appointment2, appointment3, appointment4 } from "../infra/testdata/appointment.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

const referralto = toReferralTo(appointment);
const referralto2 = toReferralTo(appointment2);
const referralto3 = toReferralTo(appointment3);
const referralto4 = toReferralTo(appointment4);

function compare(r1: ReferralTo, r2: ReferralTo): boolean {
    if(r1.id !== r2.id){
        console.log(`id: ${r1.id} : ${r2.id}`)
        return false;
    }
    if(r1.date !== r2.date){
        console.log(`date: ${r1.date} : ${r2.date}`)
        return false;
    }
    if(r1.memo !== r2.memo){
        console.log(`memo: ${r1.memo} : ${r2.memo}`)
        return false;
    }
    if(r1.personInCharge && r2.personInCharge){
        const p1 = r1.personInCharge;
        const p2 = r2.personInCharge;
        if(p1.id !== p2.id){
            console.log(`personInCharge_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`personInCharge_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    if(r1.patient && r2.patient){
        const p1 = r1.patient;
        const p2 = r2.patient;
        if(p1.id !== p2.id){
            console.log(`patient_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.lastName !== p2.lastName){
            console.log(`patient_lastname: ${p1.lastName} : ${p2.lastName}`)
            return false;
        }
        if(p1.firstName !== p2.firstName){
            console.log(`patient_firstname: ${p1.firstName} : ${p2.firstName}`)
            return false;
        }
    }
    if(r1.facility && r2.facility){
        const p1 = r1.facility;
        const p2 = r2.facility;
        if(p1.id !== p2.id){
            console.log(`facility_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`facility_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    if(r1.facilityDr !== r2.facilityDr){
        console.log(`facilityDr: ${r1.facilityDr} : ${r2.facilityDr}`)
        return false;
    }
    if(r1.facilityDept && r2.facilityDept){
        if(r1.facilityDept !== r2.facilityDept){
            console.log(`facilityDept_id: ${r1.facilityDept} : ${r2.facilityDept}`)
            return false;
        }
    }
    if(r1.department && r2.department){
        const p1 = r1.department;
        const p2 = r2.department;
        if(p1.id !== p2.id){
            console.log(`department_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`department_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    if(r1.dr && r2.dr){
        const p1 = r1.dr;
        const p2 = r2.dr;
        if(p1.id !== p2.id){
            console.log(`dr_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`dr_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    return true;
}

Kv.test = true;

Deno.test("referralto service", async (t) => {
    await t.step("insert", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        referralto.id = "";
        referralto2.id = "";
        let res = await service.insert(referralto);
        assert(res.ok);
        let list = await service.getListByDate("2024-06-01", "");
        if(!list[0].id){
            fail("id is not set");
        }
        referralto3.id = list[0].id;
        res = await service.insert(referralto2);
        assert(res.ok);
        list = await service.getListByDate("2024-06-01", "");
        for(const r of list){
            if(r.id !== referralto3.id){
                referralto4.id = r.id;
                break;
            }
        }
    });

    await t.step("update", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        let res = await service.update(referralto3);
        assert(res.ok);
        res = await service.update(referralto4);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        let res = await service.get(referralto3.id);
        if(res){
            assert(compare(referralto3, res));
        }else{
            fail();
        }
        res = await service.get(referralto4.id);
        if(res){
            assert(compare(referralto4, res));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        let res = await service.getListByDate("2024-06-07", "2024-06-07");
        if(res.length === 1){
            assert(compare(referralto3, res[0]));
        }else{
            console.log(res[0]);
            console.log(res[1]);
            console.log(`list1: ${res.length}`)
            fail();
        }
        res = await service.getListByDate("2024-06-01", "");
        if(res.length === 2){
            assert(compare(referralto3, res[0]));
            assert(compare(referralto4, res[1]));
        }else{
            console.log(`list2: ${res.length}`)
            fail();
        }
    });

    await t.step("patient", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        const res = await service.getListByPatient(referralto3.patient.id);
        if(res.length === 1){
            assert(compare(referralto3, res[0]));
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        await service.delete(referralto3);
        let res = await service.get(referralto3.id);
        assertFalse(res);
        await service.delete(referralto2);
        res = await service.get(referralto2.id);
        assertFalse(res);
    });
});