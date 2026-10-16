import { describe, test, expect } from "vitest"
import { InquiryRepository } from "../infra/inquiryRepository.ts"
import { InquiryService } from "./inquiryService.ts"
import { facility, facility2 } from "../infra/testdata/facility.ts"
import { patient, patient2, patient6 } from "../infra/testdata/patient.ts"
import { inquiry, inquiry2, inquiry3, inquiry4, inquiry5, inquiry6 } from "../infra/testdata/inquiry.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("inquiry service", () => {
    test("insert", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.insert(inquiry);
        expect(res.ok).toBe(true);
        let list = await service.getList({fromDate:"2024-06-01"});
        if(!list[0].id){
            expect.fail("id is not set");
        }
        inquiry3.id = list[0].id;
        res = await service.insert(inquiry2);
        expect(res.ok).toBe(true);
        list = await service.getList({fromDate:"2024-06-01"});
        for(const a of list){
            if(a.id !== inquiry3.id){
                inquiry4.id = a.id;
            }
        }
        res = await service.insert(inquiry5);
        expect(res.ok).toBe(true);
        list = await service.getList({fromDate:"2024-06-01"});
        for(const a of list){
            if(a.id !== inquiry3.id && a.id !== inquiry4.id){
                inquiry6.id = a.id;
            }
        }
    });

    test("update", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.update(inquiry3);
        expect(res.ok).toBe(true);
        res = await service.update(inquiry4);
        expect(res.ok).toBe(true);
        res = await service.update(inquiry6);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.get(inquiry3.id);
        expect(inquiry3).toEqual(res);
        res = await service.get(inquiry4.id);
        expect(inquiry4).toEqual(res);
    });

    test("list", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.getListByDate("2024-06-07", "2024-06-07");
        if(res.length === 1){
            expect(inquiry3).toEqual(res[0]);
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getListByDate("2024-06-01", "2999-12-31");
        if(res.length === 3){
            expect(inquiry3).toEqual(res[0]);
            expect(inquiry4).toEqual(res[1]);
            expect(inquiry6).toEqual(res[2]);
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    });

    test("patient", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.getListByPatient(patient.id);
        if(res.length === 1){
            expect(inquiry3).toEqual(res[0]);
        }else{
            console.log(`patient1: ${res.length}`)
            expect.fail();
        }
        res = await service.getListByPatient(patient2.id);
        expect(res.length).toBe(0);
        res = await service.getListByPatient(patient6.id);
        if(res.length === 1){
            expect(inquiry6).toEqual(res[0]);
        }else{
            console.log(`patient3: ${res.length}`)
            expect.fail();
        }
    });

    test("facility", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        let res = await service.getListByFacility(facility.id);
        if(res.length === 1){
            expect(inquiry3).toEqual(res[0]);
        }else{
            console.log(`facility1: ${res.length}`)
            expect.fail();
        }
        res = await service.getListByFacility(facility2.id);
        if(res.length === 2){
            expect(inquiry4).toEqual(res[0]);
            expect(inquiry6).toEqual(res[1]);
        }else{
            console.log(`facility2: ${res.length}`)
            expect.fail();
        }
        res = await service.getListByFacility("0003");
        expect(res.length).toBe(0);
    });

    test("delete", async () => {
        const repo = new InquiryRepository(BASE);
        const service = new InquiryService(repo);
        await service.delete(inquiry3);
        let res = await service.get(inquiry3.id);
        expect(res).toBeUndefined();
        await service.delete(inquiry4);
        res = await service.get(inquiry4.id);
        expect(res).toBeUndefined();
        await service.delete(inquiry6);
        res = await service.get(inquiry6.id);
        expect(res).toBeUndefined();
    });
});