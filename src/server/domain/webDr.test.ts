import { describe, test, expect } from "vitest"
import { WebDrRepository } from "../infra/webDrRepository.ts"
import { WebDrService } from "./webDrService.ts"
import { dr, dr2, dr3, dr4 } from "../infra/testdata/webDr.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("webdr service", () => {
    test("insert", async()=>{
        const repo = new WebDrRepository(BASE);
        const service = new WebDrService(repo);
        let res = await service.insert(dr);
        expect(res.ok).toBe(true);
        res = await service.insert(dr2);
        expect(res.ok).toBe(true);
        res = await service.insert(dr4);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new WebDrRepository(BASE);
        const service = new WebDrService(repo);
        const res = await service.update(dr3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new WebDrRepository(BASE);
        const service = new WebDrService(repo);
        let res = await service.get(dr.id);
        expect(dr3).toEqual(res);
        res = await service.get(dr2.id);
        expect(dr2).toEqual(res);
    });

    test("list", async () => {
        const repo = new WebDrRepository(BASE);
        const service = new WebDrService(repo);
        let res = await service.getList("02");
        if(res.length === 2){
            expect(dr2).toEqual(res[0]);
            expect(dr4).toEqual(res[1]);
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getList("01");
        if(res.length === 1){
            expect(dr3).toEqual(res[0]);
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    });

    test("delete", async () => {
        const repo = new WebDrRepository(BASE);
        const service = new WebDrService(repo);
        await service.delete(dr3);
        let res = await service.get(dr.id);
        expect(res).toBeUndefined();
        await service.delete(dr2);
        res = await service.get(dr2.id);
        expect(res).toBeUndefined();
        await service.delete(dr4);
        res = await service.get(dr4.id);
        expect(res).toBeUndefined();
    });
});