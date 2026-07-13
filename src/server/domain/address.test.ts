import { assert, assertFalse, fail } from "@std/assert"
import { AddressRepository } from "../infra/addressRepository.ts"
import { AddressService } from "./addressService.ts"
import type { Address } from "./address.ts"
import { address, address2, address3 } from "../infra/testdata/address.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: Address, u2: Address): boolean {
    if(u1.postalCode !== u2.postalCode){
        return false;
    }
    if(u1.name !== u2.name){
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("address service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new AddressRepository();
        const service = new AddressService(repo);
        let res = await service.insert(address);
        assert(res.ok);
        res = await service.insert(address2);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new AddressRepository();
        const service = new AddressService(repo);
        const res = await service.update(address3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new AddressRepository();
        const service = new AddressService(repo);
        let res = await service.get(address.postalCode);
        if(res){
            assert(compare(address3, res));
        }else{
            fail();
        }
        res = await service.get(address2.postalCode);
        if(res){
            assert(compare(address2, res));
        }else{
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new AddressRepository();
        const service = new AddressService(repo);
        await service.delete(address);
        let res = await service.get(address.postalCode);
        assertFalse(res);
        await service.delete(address2);
        res = await service.get(address2.postalCode);
        assertFalse(res);
    });
});