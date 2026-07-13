import { assert, assertFalse, fail } from "@std/assert"
import { FacilityRepository } from "../infra/facilityRepository.ts"
import { FacilityService } from "./facilityService.ts"
import type { Facility } from "./facility.ts"
import { facility, facility2, facility3 } from "../infra/testdata/facility.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: Facility, u2: Facility): boolean {
    if(u1.id !== u2.id){
        console.log(`id: ${u1.id} : ${u2.id}`);
        return false;
    }
    if(u1.name !== u2.name){
        console.log(`name: ${u1.name} : ${u2.name}`);
        return false;
    }
    if(u1.nameCorp !== u2.nameCorp){
        console.log(`nameCorp: ${u1.nameCorp} : ${u2.nameCorp}`);
        return false;
    }
    if(u1.kana !== u2.kana){
        console.log(`kana: ${u1.kana} : ${u2.kana}`);
        return false;
    }
    if(u1.tel !== u2.tel){
        console.log(`tel: ${u1.tel} : ${u2.tel}`);
        return false;
    }
    if(u1.fax !== u2.fax){
        console.log(`fax: ${u1.fax} : ${u2.fax}`);
        return false;
    }
    if(u1.email !== u2.email){
        console.log(`email: ${u1.email} : ${u2.email}`);
        return false;
    }
    if(u1.address.postalCode !== u2.address.postalCode){
        console.log(`postalCode: ${u1.address.postalCode} : ${u2.address.postalCode}`);
        return false;
    }
    if(u1.address.plus !== u2.address.plus){
        console.log(`plus: ${u1.address.plus} : ${u2.address.plus}`);
        return false;
    }
    if(u1.memo !== u2.memo){
        console.log(`memo: ${u1.memo} : ${u2.memo}`);
        return false;
    }
    if(u1.closedDate !== u2.closedDate){
        console.log(`closedDate: ${u1.closedDate} : ${u2.closedDate}`);
        return false;
    }
    if(u1.contacts.length !== u2.contacts.length){
        console.log(`contacts: ${u1.contacts.length} : ${u2.contacts.length}`);
        return false;
    }
    for(let i = 0; i < u1.contacts.length; i++){
        const c1 = u1.contacts[i];
        const c2 = u2.contacts[i];
        if(c1.tel !== c2.tel){
            console.log(`tel: ${i} : ${c1.tel} : ${c2.tel}`);
            return false;
        }
        if(c1.fax !== c2.fax){
            console.log(`fax: ${i} : ${c1.fax} : ${c2.fax}`);
            return false;
        }
        if(c1.email !== c2.email){
            console.log(`email: ${i} : ${c1.tel} : ${c2.tel}`);
            return false;
        }
        if(c1.name !== c2.name){
            console.log(`name: ${i} : ${c1.name} : ${c2.name}`);
            return false;
        }
    }
    return true;
}

Kv.test = true;

Deno.test("facilit servicey", async (t) => {
    await t.step("insert", async () => {
        const repo = new FacilityRepository(BASE);
        const service = new FacilityService(repo);
        let res = await service.insert(facility);
        assert(res.ok);
        res = await service.insert(facility2);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new FacilityRepository(BASE);
        const service = new FacilityService(repo);
        const res = await service.update(facility3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new FacilityRepository(BASE);
        const service = new FacilityService(repo);
        let res = await service.get(facility.id);
        if(res){
            assert(compare(facility3, res));
        }else{
            fail();
        }
        res = await service.get(facility2.id);
        if(res){
            assert(compare(facility2, res));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const repo = new FacilityRepository(BASE);
        const service = new FacilityService(repo);
        let res = await service.getList({name: "たこやき"});
        if(res.length === 1){
            assert(compare(facility3, res[0]));
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
        res = await service.getList({name: "病院"});
        if(res.length === 2){
            assert(compare(facility3, res[0]));
            assert(compare(facility2, res[1]));
        }else{
            console.log(`list2: ${res.length}`)
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new FacilityRepository(BASE);
        const service = new FacilityService(repo);
        await service.delete(facility);
        let res = await service.get(facility.id);
        assertFalse(res);
        await service.delete(facility2);
        res = await service.get(facility2.id);
        assertFalse(res);
    });
});