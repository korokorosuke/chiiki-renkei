import { assert, assertFalse, fail } from "@std/assert"
import { WebNoticeRepository } from "../infra/webNoticeRepository.ts"
import { WebNoticeService } from "./webNoticeService.ts"
import type { WebNotice } from "./webNotice.ts"
import { notice, notice2, notice3, notice4 } from "../infra/testdata/webNotice.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: WebNotice, u2: WebNotice): boolean {
    if(u1.id !== u2.id){
        return false;
    }
    if(u1.type !== u2.type){
        return false;
    }
    if(u1.message !== u2.message){
        return false;
    }
    if(u1.fromDate !== u2.fromDate){
        return false;
    }
    if(u1.toDate !== u2.toDate){
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("webnotice service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        let res = await service.insert(notice);
        assert(res.ok);
        let list = await service.getAll();
        if(!list[0].id){
            fail("id is not set");
        }
        notice3.id = list[0].id;
        res = await service.insert(notice2);
        assert(res.ok);
        list = await service.getAll();
        for(const a of list){
            if(a.id !== notice3.id){
                notice2.id = a.id;
            }
        }
        res = await service.insert(notice4);
        assertFalse(res.ok);
    });

    await t.step("update", async () => {
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        const today = new Date();
        notice3.toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
            .toISOString().split("T")[0];
        const res = await service.update(notice3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        let res = await service.get(notice3.id);
        if(res){
            assert(compare(notice3, res));
        }else{
            fail();
        }
        res = await service.get(notice2.id);
        if(res){
            assert(compare(notice2, res));
        }else{
            fail();
        }
        res = await service.get(notice4.id);
        if(res){
            fail();
        }else{
            assert(true);
        }
    });

    await t.step("list", async () => {
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        const res = await service.getList();
        if(res.length === 1){
            assert(compare(notice3, res[0]));
        }else{
            console.log(`list: ${res.length}`)
            fail();
        }
    });

    await t.step("all", async () => {
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        const res = await service.getAll();
        if(res.length === 2){
            assert(compare(notice3, res[0]));
            assert(compare(notice2, res[1]));
        }else{
            console.log(`all: ${res.length}`)
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new WebNoticeRepository(BASE);
        const service = new WebNoticeService(repo);
        await service.delete(notice3);
        let res = await repo.read(notice3.id);
        assertFalse(res);
        await service.delete(notice2);
        res = await repo.read(notice2.id);
        assertFalse(res);
    });
});