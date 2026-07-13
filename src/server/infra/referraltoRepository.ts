/// <reference lib="deno.unstable" />
import type { ReferralTo, Condition } from "../domain/referralto.ts"
import type { IReferralToRepository } from "../domain/referraltoService.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { Kv } from "./kv.ts"
import { PatientRepository } from "./patientRepository.ts"
import { FacilityService } from "../domain/facilityService.ts"
import { toFac } from "../lib/types.ts"
import { addDay } from "../lib/datetime.ts"

export class ReferralToRepository implements IReferralToRepository {
    database: Kv
    base: string
    KEY: string = "referralto"
    KEY2: string = "refto_date"
    KEY3: string = "refto_pat"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(r: ReferralTo): Promise<boolean> {
        const key = [this.base, this.KEY, r.id];
        if(!r.patient){
            return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, r)
            .set([this.base, this.KEY2, r.date, r.id], r)
            .set([this.base, this.KEY3, r.patient.id, r.id], r)
            .commit();
        this.database.close();
        return res.ok;
    }
    async update(r: ReferralTo): Promise<boolean> {
        const data = await this.read(r.id);
        if(!data || !data.patient || !r.patient){
            return false;
        }
        const kv = await this.database.open();
        let res;
        if(data.date === r.date){
            res = await kv.atomic()
                .set([this.base, this.KEY, r.id], r)
                .set([this.base, this.KEY2, r.date, r.id], r)
                .set([this.base, this.KEY3, r.patient.id, r.id], r)
                .commit();
        }else{
            res = await kv.atomic()
                .set([this.base, this.KEY, r.id], r)
                .delete([this.base, this.KEY2, data.date, data.id])
                .set([this.base, this.KEY2, r.date, r.id], r)
                .set([this.base, this.KEY3, r.patient.id, r.id], r)
                .commit();
        }
        this.database.close();
        return res.ok;
    }
    async delete(r: ReferralTo): Promise<void> {
        const data = await this.read(r.id);
        if(data){
            const kv = await this.database.open();
            if(!data.patient){
                return;
            }
            await kv.atomic()
                .delete([this.base, this.KEY, r.id])
                .delete([this.base, this.KEY2, data.date, r.id])
                .delete([this.base, this.KEY3, data.patient.id, r.id])
                .commit();
            this.database.close();
        }
    }
    async read(id: string): Promise<ReferralTo|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<ReferralTo>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value && res.value && res.value.patient && res.value.facility){
            const repo = new PatientRepository(this.base);
            const p = await repo.read(res.value.patient.id);
            if(p){
                res.value.patient = p;
            }
            const fservice = new FacilityService(new FacilityRepository(this.base));
            const f = await fservice.get(res.value.facility.id);
            if(f){
                res.value.facility = toFac(f);
            }
            return res.value;
        }
        return undefined;
    }

    private buildCondition(cond: Condition): Deno.KvListSelector {
        if(cond.patientId){
            return {prefix: [this.base, this.KEY3, cond.patientId]};
        }else{
            let fromDate, toDate;
            if(cond.fromDate){
                fromDate = cond.fromDate;
            }else{
                fromDate = "1900-01-01";
            }
            if(cond.toDate){
                toDate = addDay(cond.toDate);
            }else{
                toDate = "2999-12-31";
            }
            return {start: [this.base, this.KEY2, fromDate], end: [this.base, this.KEY2, toDate]};
        }
    }

    async list(cond: Condition): Promise<ReferralTo[]> {
        const key = this.buildCondition(cond);
        const kv = await this.database.open();
        const list: ReferralTo[] = [];
        const res = kv.list<ReferralTo>(key);
        if(res){
            for await (const r of res){
                list.push(r.value);
            }
        }
        this.database.close();
        return list;
    }
}