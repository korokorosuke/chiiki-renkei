/// <reference lib="deno.unstable" />
import type { Staff, Condition } from "../domain/staff.ts"
import type { IStaffRepository } from "../domain/staffService.ts"
import { Kv } from "./kv.ts"

export class StaffRepository implements IStaffRepository {
    database: Kv
    base: string
    KEY: string = "staff"
    KEY2: string = "staff_fac"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(s: Staff): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, s.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, s)
            .set([this.base, this.KEY2, s.facilityId, s.id], s)
            .commit();
        this.database.close();
        return res.ok;
    }
    async update(s: Staff): Promise<boolean> {
        const data = await this.read(s.id);
        if(!data){
            return false;
        }
        let res;
        const kv = await this.database.open();
        if(s.facilityId === data.facilityId){
            res = await kv.atomic()
                .set([this.base, this.KEY, s.id], s)
                .set([this.base, this.KEY2, s.facilityId, s.id], s)
                .commit();
        }else{
            res = await kv.atomic()
                .set([this.base, this.KEY, s.id], s)
                .set([this.base, this.KEY2, s.facilityId, s.id], s)
                .delete([this.base, this.KEY2, data.facilityId, data.id])
                .commit();
        }
        this.database.close();
        return res.ok;
    }
    async delete(s: Staff): Promise<void> {
        const data = await this.read(s.id);
        if(!data){
            return;
        }
        const kv = await this.database.open();
        await kv.atomic()
            .delete([this.base, this.KEY, s.id])
            .delete([this.base, this.KEY2, data.facilityId, s.id])
            .commit();
        this.database.close();
    }

    async read(id: string): Promise<Staff|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Staff>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }

    async list(cond: Condition): Promise<Staff[]> {
        const kv = await this.database.open();
        const list: Staff[] = [];
        let key;
        if(cond.facilityid){
            key = {prefix: [this.base, this.KEY2, cond.facilityid]}
        }else{
            return [];
        }
        const res = kv.list<Staff>(key);
        for await (const s of res){
            if(cond.dr && !s.value.dr){
                continue;
            }
            if(!cond.hidden && s.value.hidden){
                continue;
            }
            list.push(s.value);
        }
        this.database.close();
        return list;
    }
}