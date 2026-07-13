import { assert, assertFalse, fail } from "@std/assert"
import { DueRepository } from "../infra/dueRepository.ts"
import { DueService } from "./dueService.ts"
import type { Due } from "./due.ts"
import { due, due2, due3, due4 } from "../infra/testdata/due.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: Due, u2: Due): boolean {
    if(u1.id !== u2.id){
        return false;
    }
    if(u1.name !== u2.name){
        return false;
    }
    if(u1.days !== u2.days){
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("due service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new DueRepository(BASE);
        const service = new DueService(repo);
        let res = await service.insert(due);
        assert(res.ok);
        res = await service.insert(due2);
        assert(res.ok);
        res = await service.insert(due4);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new DueRepository(BASE);
        const service = new DueService(repo);
        const res = await service.update(due3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new DueRepository(BASE);
        const service = new DueService(repo);
        let res = await service.get(due.id);
        if(res){
            assert(compare(due3, res));
        }else{
            fail();
        }
        res = await service.get(due2.id);
        if(res){
            assert(compare(due2, res));
        }else{
            fail();
        }
    });

    await t.step("all", async () => {
        const repo = new DueRepository(BASE);
        const service = new DueService(repo);
        const res = await service.getAll();
        if(res.length === 3){
            assert(compare(due3, res[0]));
            assert(compare(due2, res[1]));
            assert(compare(due4, res[2]));
        }else{
            console.log(`list2: ${res.length}`)
            fail();
        }
    })

    await t.step("delete", async () => {
        const repo = new DueRepository(BASE);
        const service = new DueService(repo);
        await service.delete(due);
        let res = await service.get(due3.id);
        assertFalse(res);
        await service.delete(due2);
        res = await service.get(due2.id);
        assertFalse(res);
        await service.delete(due4);
        res = await service.get(due4.id);
        assertFalse(res);
    });
});