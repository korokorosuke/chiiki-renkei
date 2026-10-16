import { describe, test, expect } from "vitest"
import { DueRepository } from "../infra/dueRepository.ts"
import { DueService } from "./dueService.ts"
import { due, due2, due3, due4 } from "../infra/testdata/due.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("due service", () => {
    test("insert", async()=>{
        const repo = new DueRepository(BASE);
        const service = new DueService(repo);
        let res = await service.insert(due);
        expect(res.ok).toBe(true);
        res = await service.insert(due2);
        expect(res.ok).toBe(true);
        res = await service.insert(due4);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new DueRepository(BASE);
        const service = new DueService(repo);
        const res = await service.update(due3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new DueRepository(BASE);
        const service = new DueService(repo);
        let res = await service.get(due.id);
        expect(due3).toEqual(res);
        res = await service.get(due2.id);
        expect(due2).toEqual(res);
    });

    test("all", async () => {
        const repo = new DueRepository(BASE);
        const service = new DueService(repo);
        const res = await service.getAll();
        if(res.length === 3){
            expect(due3).toEqual(res[0]);
            expect(due2).toEqual(res[1]);
            expect(due4).toEqual(res[2]);
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    })

    test("delete", async () => {
        const repo = new DueRepository(BASE);
        const service = new DueService(repo);
        await service.delete(due);
        let res = await service.get(due3.id);
        expect(res).toBeUndefined();
        await service.delete(due2);
        res = await service.get(due2.id);
        expect(res).toBeUndefined();
        await service.delete(due4);
        res = await service.get(due4.id);
        expect(res).toBeUndefined();
    });
});