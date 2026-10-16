import { describe, test, expect } from "vitest"
import { WebNoticeRepository } from "../infra/webNoticeRepository.ts"
import { WebNoticeService } from "./webNoticeService.ts"
import { NOTICE_PAGES } from "./webNotice.ts"
import { notice, notice2, notice3, notice4 } from "../infra/testdata/webNotice.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("webnotice service", () => {
    test("insert", async()=>{
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        let res = await service.insert(notice);
        expect(res.ok).toBe(true);
        let list = await service.getAll();
        if(!list[0].id){
            expect.fail("id is not set");
        }
        notice3.id = list[0].id;
        res = await service.insert(notice2);
        expect(res.ok).toBe(true);
        list = await service.getAll();
        for(const a of list){
            if(a.id !== notice3.id){
                notice2.id = a.id;
            }
        }
        res = await service.insert(notice4);
        expect(res.ok).toBe(false);
    });

    test("update", async () => {
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        const today = new Date();
        notice3.toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
            .toISOString().split("T")[0];
        const res = await service.update(notice3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        let res = await service.get(notice3.id);
        expect(notice3).toEqual(res);
        res = await service.get(notice2.id);
        expect(notice2).toEqual(res);
        res = await service.get(notice4.id);
        expect(res).toBeUndefined();
    });

    test("list", async () => {
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        const res = await service.getList(NOTICE_PAGES[1]);
        if(res.length === 1){
            expect(notice3).toEqual(res[0]);
        }else{
            console.log(`list: ${res.length}`)
            expect.fail();
        }
    });

    test("all", async () => {
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        const res = await service.getAll();
        if(res.length === 2){
            expect(notice2).toEqual(res[0]);
            expect(notice3).toEqual(res[1]);
        }else{
            console.log(`all: ${res.length}`)
            expect.fail();
        }
    });

    test("delete", async () => {
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        await service.delete(notice3);
        let res = await repo.read(notice3.id);
        expect(res).toBeUndefined();
        await service.delete(notice2);
        res = await repo.read(notice2.id);
        expect(res).toBeUndefined();
    });
});