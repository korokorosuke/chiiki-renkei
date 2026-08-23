/// <reference lib="deno.unstable" />
import type { Address } from "../domain/address.ts"
import type { IAddressRepository } from "../domain/addressService.ts"
import { Kv } from "./kv.ts"

export class AddressRepository implements IAddressRepository {
    database: Kv
    KEY: string = "address"
    constructor(){
        this.database = new Kv();
    }
    async insert(d: Address): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.KEY, d.postalCode];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, d).commit();
        this.database.close();
        return res.ok;
    }
    async update(d: Address): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.KEY, d.postalCode], d);
        this.database.close();
        return res.ok;
    }
    async delete(d: Address): Promise<boolean> {
        const kv = await this.database.open();
        await kv.delete([this.KEY, d.postalCode]);
        this.database.close();
        return true;
    }
    async read(postalCode: string): Promise<Address|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Address>([this.KEY, postalCode]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
}