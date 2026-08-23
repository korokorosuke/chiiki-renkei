/// <reference lib="deno.unstable" />
import type { Staff, Condition } from "../domain/staff.ts"
import type { IStaffRepository } from "../domain/staffService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

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
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(s: Staff): Promise<boolean> {
        const data = await this.read(s.id);
        if(!data){
            await fatal(`${this.constructor.name} update`, "データが存在しません", this.base);
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
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(s: Staff): Promise<boolean> {
        const data = await this.read(s.id);
        if(!data){
            await fatal(`${this.constructor.name} delete`, "データが存在しません", this.base);
            return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic()
            .delete([this.base, this.KEY, s.id])
            .delete([this.base, this.KEY2, data.facilityId, s.id])
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} delete`, "失敗しました", this.base);
        }
        return res.ok;
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

    sort(ss: Staff[]){
        return ss.sort((s1, s2)=>{
            if(s1.sort > s2.sort){
                return 1;
            }else if(s1.sort < s2.sort){
                return -1;
            }else{
                return 0;
            }
        });
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
        return this.sort(list);
    }
}