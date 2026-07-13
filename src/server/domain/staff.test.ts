import { assert, assertFalse, fail } from "@std/assert"
import { StaffRepository } from "../infra/staffRepository.ts"
import { StaffService } from "./staffService.ts"
import type { Staff } from "./staff.ts"
import { staff, staff2, staff3, staff4 } from "../infra/testdata/staff.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: Staff, u2: Staff): boolean {
    if(u1.id !== u2.id){
        return false;
    }
    if(u1.name !== u2.name){
        return false;
    }
    if(u1.kana !== u2.kana){
        return false;
    }
    if(u1.department !== u2.department){
        return false;
    }
    if(u1.dr !== u2.dr){
        return false;
    }
    if(u1.facilityId !== u2.facilityId){
        return false;
    }
    if(u1.hidden !== u2.hidden){
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("staff service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new StaffRepository(BASE);
        const service = new StaffService(repo);
        let res = await service.insert(staff);
        assert(res.ok);
        let list = await service.getList(staff.facilityId);
        if(!list[0].id){
            fail("id is not set");
        }
        staff3.id = list[0].id;
        res = await service.insert(staff2);
        assert(res.ok);
        list = await service.getList(staff2.facilityId);
        for(const s of list){
            if(s.id !== staff.id){
                staff2.id = s.id;
                break;
            }
        }
        res = await service.insert(staff4);
        assert(res.ok);
        list = await service.getList(staff4.facilityId);
        for(const s of list){
            if(s.id !== staff.id && s.id !== staff2.id){
                staff4.id = s.id;
                break;
            }
        }
    });

    await t.step("update", async () => {
        const repo = new StaffRepository(BASE);
        const service = new StaffService(repo);
        const res = await service.update(staff3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new StaffRepository(BASE);
        const service = new StaffService(repo);
        let res = await service.get(staff3.id);
        if(res){
            assert(compare(staff3, res));
        }else{
            fail();
        }
        res = await service.get(staff2.id);
        if(res){
            assert(compare(staff2, res));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const repo = new StaffRepository(BASE);
        const service = new StaffService(repo);
        let res = await service.getAll("00001");
        if(res.length === 2){
            assert(compare(staff3, res[0]));
            assert(compare(staff2, res[1]));
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
        res = await service.getList("00001");
        if(res.length === 1){
            assert(compare(staff3, res[0]));
        }else{
            console.log(`list2: ${res.length}`)
            fail();
        }
        res = await service.getDr("00002");
        if(res.length === 1){
            assert(compare(staff4, res[0]));
        }else{
            console.log(`list3: ${res.length}`)
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new StaffRepository(BASE);
        const service = new StaffService(repo);
        await service.delete(staff);
        let res = await service.get(staff.id);
        assertFalse(res);
        await service.delete(staff2);
        res = await service.get(staff2.id);
        assertFalse(res);
        await service.delete(staff4);
        res = await service.get(staff4.id);
        assertFalse(res);
    });
});