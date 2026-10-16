import { describe, test, expect } from "vitest"
import { FacilityRepository } from "../infra/facilityRepository.ts"
import { FacilityService } from "./facilityService.ts"
import { facility, facility2, facility3 } from "../infra/testdata/facility.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("facilit servicey", () => {
    test("insert", async () => {
        const repo = new FacilityRepository(BASE);
        const service = new FacilityService(repo);
        let res = await service.insert(facility);
        expect(res.ok).toBe(true);
        res = await service.insert(facility2);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new FacilityRepository(BASE);
        const service = new FacilityService(repo);
        const res = await service.update(facility3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new FacilityRepository(BASE);
        const service = new FacilityService(repo);
        let res = await service.get(facility.id);
        expect(facility3).toEqual(res);
        res = await service.get(facility2.id);
        expect(facility2).toEqual(res);
    });

    test("list", async () => {
        const repo = new FacilityRepository(BASE);
        const service = new FacilityService(repo);
        let res = await service.getList({name: "たこやき"});
        if(res.length === 1){
            expect(facility3).toEqual(res[0]);
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getList({name: "病院"});
        if(res.length === 2){
            expect(facility3).toEqual(res[0]);
            expect(facility2).toEqual(res[1]);
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    });

    test("delete", async () => {
        const repo = new FacilityRepository(BASE);
        const service = new FacilityService(repo);
        await service.delete(facility);
        let res = await service.get(facility.id);
        expect(res).toBeUndefined();
        await service.delete(facility2);
        res = await service.get(facility2.id);
        expect(res).toBeUndefined();
    });
});