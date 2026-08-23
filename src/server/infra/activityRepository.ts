/// <reference lib="deno.unstable" />
import type { Activity, Condition } from "../domain/activity.ts"
import type { IActivityRepository } from "../domain/activityService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

export class ActivityRepository implements IActivityRepository {
    database: Kv
    base: string
    KEY: string = "activity"
    KEY2: string = "act_date"
    KEY3: string = "act_fac"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(act: Activity): Promise<boolean> {
        const key = [this.base, this.KEY, act.id];
        const kv = await this.database.open();
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, act)
            .set([this.base, this.KEY2, this.toYMD(act.date), act.id], act)
            .set([this.base, this.KEY3, act.facility.id, act.id], act)
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(act: Activity): Promise<boolean> {
        const data = await this.read(act.id);
        if(!data){
            await fatal(`${this.constructor.name} update`, "データが存在しません", this.base);
            return false;
        }
        const kv = await this.database.open();
        let res;
        if(data.date === act.date){
            res = await kv.atomic()
                .set([this.base, this.KEY, act.id], act)
                .set([this.base, this.KEY2, this.toYMD(act.date), act.id], act)
                .delete([this.base, this.KEY3, data.facility.id, data.id])
                .set([this.base, this.KEY3, act.facility.id, act.id], act)
                .commit();
        }else{
            res = await kv.atomic()
                .set([this.base, this.KEY, act.id], act)
                .delete([this.base, this.KEY2, this.toYMD(data.date), data.id])
                .set([this.base, this.KEY2, this.toYMD(act.date), act.id], act)
                .delete([this.base, this.KEY3, data.facility.id, data.id])
                .set([this.base, this.KEY3, act.facility.id, act.id], act)
                .commit();
        }
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(act: Activity): Promise<boolean> {
        const data = await this.read(act.id);
        if(!data){
            await fatal(`${this.constructor.name} delete`, "データが存在しません", this.base);
            return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic()
            .delete([this.base, this.KEY, act.id])
            .delete([this.base, this.KEY2, this.toYMD(data.date), act.id])
            .delete([this.base, this.KEY3, data.facility.id, data.id])
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} delete`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async read(id: string): Promise<Activity|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Activity>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value && res.value && res.value.facility){
            return res.value;
        }
        return undefined;
    }

    private buildCondition(cond: Condition): Deno.KvListSelector {
        let fromDate, toDate;
        if(cond.facilityId){
            return {prefix: [this.base, this.KEY3, cond.facilityId]};
        }else if(cond.fromDate){
            fromDate = this.toYMD(cond.fromDate);
        }else{
            fromDate = 19000101;
        }
        if(cond.toDate){
            toDate = this.toYMD(cond.toDate) + 1;
        }else{
            toDate = 29991231;
        }
        return {start: [this.base, this.KEY2, fromDate], end: [this.base, this.KEY2, toDate]};
    }

    async list(cond: Condition): Promise<Activity[]> {
        const key = this.buildCondition(cond);
        const kv = await this.database.open();
        const list: Activity[] = [];
        const res = kv.list<Activity>(key);
        if(res){
            for await (const r of res){
                list.push(r.value);
            }
        }
        this.database.close();
        return list;
    }

    private toYMD(d: string): number{
        return parseInt(d.substring(0, 10).replaceAll("-", ""));
    }
}