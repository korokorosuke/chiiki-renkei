/// <reference lib="deno.unstable" />
import type { Facility } from "../domain/facility.ts"
import type { IFacilityRepository } from "../domain/facilityService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

export class FacilityRepository implements IFacilityRepository {
    database: Kv
    base: string
    KEY: string = "facility"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(f: Facility): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, f.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, f).commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(f: Facility): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, f.id], f);
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(f: Facility): Promise<boolean> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, f.id]);
        this.database.close();
        return true;
    }
    async read(id: string): Promise<Facility|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Facility>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async list(name: string): Promise<Facility[]> {
        const kv = await this.database.open();
        const list: Facility[] = [];
        const res = kv.list<Facility>({prefix: [this.base, this.KEY]});
        if(res){
            for await (const f of res){
                if(f.value.name.indexOf(name) >= 0 || f.value.kana.indexOf(name) >= 0){
                    list.push(f.value);
                }
            }
        }
        this.database.close();
        return list;
    }
}