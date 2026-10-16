import { describe, test, expect } from "vitest"
import { ClassificationRepository } from "../infra/classificationRepository.ts"
import { ClassificationService } from "./classificationService.ts"
import { classification1, classification2, classification3, classification4 } from "../infra/testdata/classification.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("Classification service", () => {
    test("insert", async()=>{
        const repo = new ClassificationRepository(BASE);
        const service = new ClassificationService(repo);
        let res = await service.insert(classification1);
        expect(res.ok).toBe(true);
        res = await service.insert(classification2);
        expect(res.ok).toBe(true);
        res = await service.insert(classification4);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new ClassificationRepository(BASE);
        const service = new ClassificationService(repo);
        const res = await service.update(classification3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new ClassificationRepository(BASE);
        const service = new ClassificationService(repo);
        let res = await service.get(classification1.id);
        expect(classification3).toEqual(res);
        res = await service.get(classification2.id);
        expect(classification2).toEqual(res);
    });

    test("all", async () => {
        const repo = new ClassificationRepository(BASE);
        const service = new ClassificationService(repo);
        const res = await service.getAll();
        if(res.length === 3){
            expect(classification3).toEqual(res[0]);
            expect(classification2).toEqual(res[1]);
            expect(classification4).toEqual(res[2]);
        }else{
            console.log(`all: ${res.length}`)
            expect.fail();
        }
    })

    test("delete", async () => {
        const repo = new ClassificationRepository(BASE);
        const service = new ClassificationService(repo);
        await service.delete(classification1);
        let res = await service.get(classification1.id);
        expect(res).toBeUndefined();
        await service.delete(classification2);
        res = await service.get(classification2.id);
        expect(res).toBeUndefined();
        await service.delete(classification4);
        res = await service.get(classification4.id);
        expect(res).toBeUndefined();
    });
});