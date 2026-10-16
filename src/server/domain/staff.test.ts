import { describe, test, expect } from "vitest"
import { StaffRepository } from "../infra/staffRepository.ts"
import { StaffService } from "./staffService.ts"
import { staff, staff2, staff3, staff4 } from "../infra/testdata/staff.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("staff service", () => {
    test("insert", async()=>{
        const repo = new StaffRepository(BASE);
        const service = new StaffService(repo);
        let res = await service.insert(staff);
        expect(res.ok).toBe(true);
        let list = await service.getList(staff.facilityId);
        if(!list[0].id){
            expect.fail("id is not set");
        }
        staff3.id = list[0].id;
        res = await service.insert(staff2);
        expect(res.ok).toBe(true);
        list = await service.getList(staff2.facilityId);
        for(const s of list){
            if(s.id !== staff.id){
                staff2.id = s.id;
                break;
            }
        }
        res = await service.insert(staff4);
        expect(res.ok).toBe(true);
        list = await service.getList(staff4.facilityId);
        for(const s of list){
            if(s.id !== staff.id && s.id !== staff2.id){
                staff4.id = s.id;
                break;
            }
        }
    });

    test("update", async () => {
        const repo = new StaffRepository(BASE);
        const service = new StaffService(repo);
        const res = await service.update(staff3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new StaffRepository(BASE);
        const service = new StaffService(repo);
        let res = await service.get(staff3.id);
        expect(staff3).toEqual(res);
        res = await service.get(staff2.id);
        expect(staff2).toEqual(res);
    });

    test("list", async () => {
        const repo = new StaffRepository(BASE);
        const service = new StaffService(repo);
        let res = await service.getAll("00001");
        if(res.length === 2){
            expect(staff3).toEqual(res[0]);
            expect(staff2).toEqual(res[1]);
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getList("00001");
        if(res.length === 1){
            expect(staff3).toEqual(res[0]);
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
        res = await service.getDr("00002");
        if(res.length === 1){
            expect(staff4).toEqual(res[0]);
        }else{
            console.log(`list3: ${res.length}`)
            expect.fail();
        }
    });

    test("delete", async () => {
        const repo = new StaffRepository(BASE);
        const service = new StaffService(repo);
        await service.delete(staff);
        let res = await service.get(staff.id);
        expect(res).toBeUndefined();
        await service.delete(staff2);
        res = await service.get(staff2.id);
        expect(res).toBeUndefined();
        await service.delete(staff4);
        res = await service.get(staff4.id);
        expect(res).toBeUndefined();
    });
});