import { describe, test, expect } from "vitest"
import { AddressRepository } from "../infra/addressRepository.ts"
import { AddressService } from "./addressService.ts"
import { address, address2, address3 } from "../infra/testdata/address.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("address service", () => {
    test("insert", async()=>{
        const repo = new AddressRepository();
        const service = new AddressService(repo);
        let res = await service.insert(address);
        expect(res.ok).toBe(true);
        res = await service.insert(address2);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new AddressRepository();
        const service = new AddressService(repo);
        const res = await service.update(address3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new AddressRepository();
        const service = new AddressService(repo);
        let res = await service.get(address.postalCode);
        expect(address3).toEqual(res);
        res = await service.get(address2.postalCode);
        expect(address2).toEqual(res);
    });

    test("delete", async () => {
        const repo = new AddressRepository();
        const service = new AddressService(repo);
        await service.delete(address);
        let res = await service.get(address.postalCode);
        expect(res).toBeUndefined();
        await service.delete(address2);
        res = await service.get(address2.postalCode);
        expect(res).toBeUndefined();
    });
});