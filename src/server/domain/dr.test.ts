import { assert, assertFalse, fail } from "@std/assert"
import { DrRepository } from "../infra/drRepository.ts"
import { DrService } from "./drService.ts"
import type { Dr } from "./dr.ts"
import { dr, dr2, dr3, dr4} from "../infra/testdata/dr.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: Dr, u2: Dr): boolean {
    if(u1.id !== u2.id){
        return false;
    }
    if(u1.name !== u2.name){
        return false;
    }
    if(u1.department !== u2.department){
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("dr service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new DrRepository(BASE);
        const service = new DrService(repo);
        let res = await service.insert(dr);
        assert(res.ok);
        res = await service.insert(dr2);
        assert(res.ok);
        res = await service.insert(dr4);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new DrRepository(BASE);
        const service = new DrService(repo);
        const res = await service.update(dr3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new DrRepository(BASE);
        const service = new DrService(repo);
        let res = await service.get(dr.id);
        if(res){
            assert(compare(dr3, res));
        }else{
            fail();
        }
        res = await service.get(dr2.id);
        if(res){
            assert(compare(dr2, res));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const repo = new DrRepository(BASE);
        const service = new DrService(repo);
        let res = await service.getList("02");
        if(res.length === 2){
            assert(compare(dr2, res[0]));
            assert(compare(dr4, res[1]));
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
        res = await service.getList("01");
        if(res.length === 1){
            assert(compare(dr3, res[0]));
        }else{
            console.log(`list2: ${res.length}`)
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new DrRepository(BASE);
        const service = new DrService(repo);
        await service.delete(dr3);
        let res = await service.get(dr.id);
        assertFalse(res);
        await service.delete(dr2);
        res = await service.get(dr2.id);
        assertFalse(res);
        await service.delete(dr4);
        res = await service.get(dr4.id);
        assertFalse(res);
    });
});