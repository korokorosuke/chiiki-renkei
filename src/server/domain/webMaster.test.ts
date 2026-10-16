import { describe, test, expect } from "vitest"
import { WebMasterRepository } from "../infra/webMasterRepository.ts"
import { WebMasterService } from "./webMasterService.ts"
import { master, master2, master3, master4 } from "../infra/testdata/webMaster.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("webmaster service", () => {
    test("insert", async()=>{
        const repo = new WebMasterRepository(BASE);
        const service = new WebMasterService(repo);
        let res = await service.insert(master);
        expect(res.ok).toBe(true);
        res = await service.insert(master2);
        expect(res.ok).toBe(true);
        res = await service.insert(master4);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new WebMasterRepository(BASE);
        const service = new WebMasterService(repo);
        const res = await service.update(master3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new WebMasterRepository(BASE);
        const service = new WebMasterService(repo);
        let res = await service.get("02", "0001", 2);
        expect(master2).toEqual(res);
        res = await service.get("01", "0001", 2);
        expect(master3).toEqual(res);
        res = await service.get("01", "0001", 3);
        expect(master4).toEqual(res);
    });

    test("delete", async () => {
        const repo = new WebMasterRepository(BASE);
        const service = new WebMasterService(repo);
        await service.delete(master3);
        let res = await repo.read(master3.dept, master3.dr, master3.week);
        expect(res).toBeUndefined();
        await service.delete(master2);
        res = await repo.read(master2.dept, master2.dr, master2.week);
        expect(res).toBeUndefined();
        await service.delete(master4);
        res = await repo.read(master4.dept, master4.dr, master4.week);
        expect(res).toBeUndefined();
    });
});