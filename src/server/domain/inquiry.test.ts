import { assert, assertFalse, fail } from "@std/assert"
import { InquiryRepository } from "../infra/inquiryRepository.ts"
import { InquiryService } from "./inquiryService.ts"
import type { Inquiry } from "./inquiry.ts"
import { facility, facility2 } from "../infra/testdata/facility.ts"
import { patient, patient2, patient6 } from "../infra/testdata/patient.ts"
import { inquiry, inquiry2, inquiry3, inquiry4, inquiry5, inquiry6 } from "../infra/testdata/inquiry.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(val1: Inquiry, val2: Inquiry): boolean {
    if(val1.id !== val2.id){
        console.log(`id: ${val1.id} : ${val2.id}`)
        return false;
    }
    if(val1.datetime !== val2.datetime){
        console.log(`date: ${val1.datetime} : ${val2.datetime}`)
        return false;
    }
    if(val1.facilityStaff !== val2.facilityStaff){
        console.log(`facilityStaff: ${val1.facilityStaff} : ${val2.facilityStaff}`)
        return false;
    }
    if(val1.tel !== val2.tel){
        console.log(`tel: ${val1.tel} : ${val2.tel}`)
        return false;
    }
    if(val1.due && val2.due){
        const v1 = val1.due;
        const v2 = val2.due;
        if(v1.id !== v2.id){
            console.log(`due_id: ${v1.id} : ${v2.id}`)
            return false;
        }
        if(v1.name !== v2.name){
            console.log(`due_name: ${v1.name} : ${v2.name}`)
            return false;
        }
        if(v1.days !== v2.days){
            console.log(`due_name: ${v1.days} : ${v2.days}`)
            return false;
        }
    }
    if(val1.personInCharge && val2.personInCharge){
        const v1 = val1.personInCharge;
        const v2 = val2.personInCharge;
        if(v1.id !== v2.id){
            console.log(`personInCharge_id: ${v1.id} : ${v2.id}`)
            return false;
        }
        if(v1.name !== v2.name){
            console.log(`personInCharge_name: ${v1.name} : ${v2.name}`)
            return false;
        }
    }
    if(val1.patient && val2.patient){
        const v1 = val1.patient;
        const v2 = val2.patient;
        if(v1.id !== v2.id){
            console.log(`patient_id: ${v1.id} : ${v2.id}`)
            return false;
        }
        if(v1.lastName !== v2.lastName){
            console.log(`patient_name: ${v1.lastName} : ${v2.lastName}`)
            return false;
        }
        if(v1.firstName !== v2.firstName){
            console.log(`patient_name: ${v1.firstName} : ${v2.firstName}`)
            return false;
        }
    }
    if(val1.facility && val2.facility){
        const v1 = val1.facility;
        const v2 = val2.facility;
        if(v1.id !== v2.id){
            console.log(`facility_id: ${v1.id} : ${v2.id}`)
            return false;
        }
        if(v1.name !== v2.name){
            console.log(`facility_name: ${v1.name} : ${v2.name}`)
            return false;
        }
    }
    for(let i = 0; i < val1.responses.length; i++){
        if(val1.facility && val2.facility){
            const v1 = val1.facility;
            const v2 = val2.facility;
            if(v1.id !== v2.id){
                console.log(`facility_id: ${v1.id} : ${v2.id}`)
                return false;
            }
            if(v1.name !== v2.name){
                console.log(`facility_name: ${v1.name} : ${v2.name}`)
                return false;
            }
        }
    }
    return true;
}

Kv.test = true;

Deno.test("inquiry service", async (t) => {
    await t.step("insert", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.insert(inquiry);
        assert(res.ok);
        let list = await service.getList({fromDate:"2024-06-01"});
        if(!list[0].id){
            fail("id is not set");
        }
        inquiry3.id = list[0].id;
        res = await service.insert(inquiry2);
        assert(res.ok);
        list = await service.getList({fromDate:"2024-06-01"});
        for(const a of list){
            if(a.id !== inquiry3.id){
                inquiry4.id = a.id;
            }
        }
        res = await service.insert(inquiry5);
        assert(res.ok);
        list = await service.getList({fromDate:"2024-06-01"});
        for(const a of list){
            if(a.id !== inquiry3.id && a.id !== inquiry4.id){
                inquiry6.id = a.id;
            }
        }
    });

    await t.step("update", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.update(inquiry3);
        assert(res.ok);
        res = await service.update(inquiry4);
        assert(res.ok);
        res = await service.update(inquiry6);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.get(inquiry3.id);
        if(res){
            assert(compare(inquiry3, res));
        }else{
            fail();
        }
        res = await service.get(inquiry4.id);
        if(res){
            assert(compare(inquiry4, res));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.getListByDate("2024-06-07", "2024-06-07");
        if(res.length === 1){
            assert(compare(inquiry3, res[0]));
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
        res = await service.getListByDate("2024-06-01", "2999-12-31");
        if(res.length === 3){
            assert(compare(inquiry3, res[0]));
            assert(compare(inquiry4, res[1]));
            assert(compare(inquiry6, res[2]));
        }else{
            console.log(`list2: ${res.length}`)
            fail();
        }
    });

    await t.step("patient", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.getListByPatient(patient.id);
        if(res.length === 1){
            assert(compare(inquiry3, res[0]));
        }else{
            console.log(`patient1: ${res.length}`)
            fail();
        }
        res = await service.getListByPatient(patient2.id);
        if(res.length === 0){
            assert(true);
        }else{
            console.log(`patient2: ${res.length}`)
            fail();
        }
        res = await service.getListByPatient(patient6.id);
        if(res.length === 1){
            assert(compare(inquiry6, res[0]));
        }else{
            console.log(`patient3: ${res.length}`)
            fail();
        }
    });

    await t.step("facility", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.getListByFacility(facility.id);
        if(res.length === 1){
            assert(compare(inquiry3, res[0]));
        }else{
            console.log(`facility1: ${res.length}`)
            fail();
        }
        res = await service.getListByFacility(facility2.id);
        if(res.length === 2){
            assert(compare(inquiry4, res[0]));
            assert(compare(inquiry6, res[1]));
        }else{
            console.log(`facility2: ${res.length}`)
            fail();
        }
        res = await service.getListByFacility("0003");
        if(res.length === 0){
            assert(true);
        }else{
            console.log(`facility3: ${res.length}`)
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        await service.delete(inquiry3);
        let res = await service.get(inquiry3.id);
        assertFalse(res);
        await service.delete(inquiry4);
        res = await service.get(inquiry4.id);
        assertFalse(res);
        await service.delete(inquiry6);
        res = await service.get(inquiry6.id);
        assertFalse(res);
    });
});