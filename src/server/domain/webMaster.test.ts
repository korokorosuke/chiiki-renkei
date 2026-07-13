import { assert, assertFalse, fail } from "@std/assert"
import { WebMasterRepository } from "../infra/webMasterRepository.ts"
import { WebMasterService } from "./webMasterService.ts"
import type { WebMaster } from "./webMaster.ts"
import { master, master2, master3, master4 } from "../infra/testdata/webMaster.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: WebMaster, u2: WebMaster): boolean {
    if(u1.dept !== u2.dept){
        return false;
    }
    if(u1.dr !== u2.dr){
        return false;
    }
    if(u1.week !== u2.week){
        return false;
    }
    if(u1.reservs.length === u2.reservs.length){
        for(let i = 0; i<u1.reservs.length; i++){
            if(u1.reservs[i].time !== u2.reservs[i].time){
                return false;
            }
            if(u1.reservs[i].max !== u2.reservs[i].max){
                return false;
            }
        }
    }else{
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("webmaster service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new WebMasterRepository(BASE);
        const service = new WebMasterService(repo);
        let res = await service.insert(master);
        assert(res.ok);
        res = await service.insert(master2);
        assert(res.ok);
        res = await service.insert(master4);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new WebMasterRepository(BASE);
        const service = new WebMasterService(repo);
        const res = await service.update(master3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new WebMasterRepository(BASE);
        const service = new WebMasterService(repo);
        let res = await service.get("02", "0001", 2);
        if(res){
            assert(compare(master2, res));
        }else{
            fail();
        }
        res = await service.get("01", "0001", 2);
        if(res){
        assert(compare(master3, res));
        }else{
            fail();
        }
        res = await service.get("01", "0001", 3);
        if(res){
        assert(compare(master4, res));
        }else{
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new WebMasterRepository(BASE);
        const service = new WebMasterService(repo);
        await service.delete(master3);
        let res = await repo.read(master3.dept, master3.dr, master3.week);
        assertFalse(res);
        await service.delete(master2);
        res = await repo.read(master2.dept, master2.dr, master2.week);
        assertFalse(res);
        await service.delete(master4);
        res = await repo.read(master4.dept, master4.dr, master4.week);
        assertFalse(res);
    });
});