/// <reference lib="deno.unstable" />
import type { Inquiry, Condition } from "../domain/inquiry.ts"
import type { IInquiryRepository } from "../domain/inquiryService.ts"
import { toDateString } from "../../lib/datetime.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { Kv } from "./kv.ts"
import { PatientRepository } from "./patientRepository.ts"
import { FacilityService } from "../domain/facilityService.ts"
import { toFac } from "../lib/types.ts"
import { addDay } from "../lib/datetime.ts"

export class InquiryRepository implements IInquiryRepository {
    database: Kv
    base: string
    KEY: string = "inquiry"
    KEY2: string = "inq_date"
    KEY3: string = "inq_pat"
    KEY4: string = "inq_fac"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(val: Inquiry): Promise<boolean> {
        const key = [this.base, this.KEY, val.id];
        const kv = await this.database.open();
        let res;
        if(!val.patient.id){
            res = await kv.atomic().check({key, versionstamp: null})
                .set(key, val)
                .set([this.base, this.KEY2, val.datetime, val.id], val)
                .set([this.base, this.KEY4, val.facility.id, val.id], val)
                .commit();
        }else{
            res = await kv.atomic().check({key, versionstamp: null})
                .set(key, val)
                .set([this.base, this.KEY2, val.datetime, val.id], val)
                .set([this.base, this.KEY3, val.patient.id, val.id], val)
                .set([this.base, this.KEY4, val.facility.id, val.id], val)
                .commit();
        }
        this.database.close();
        return res.ok;
    }
    async update(val: Inquiry): Promise<boolean> {
        const data = await this.read(val.id);
        const kv = await this.database.open();
        let res;
        if(!data){
            return false;
        }
        if(val.patient.id){
            if(data.patient.id){
                res = await kv.atomic()
                    .set([this.base, this.KEY, val.id], val)
                    .delete([this.base, this.KEY2, data.datetime, data.id])
                    .set([this.base, this.KEY2, val.datetime, val.id], val)
                    .delete([this.base, this.KEY3, data.patient.id, val.id])
                    .set([this.base, this.KEY3, val.patient.id, val.id], val)
                    .delete([this.base, this.KEY4, data.facility.id, val.id])
                    .set([this.base, this.KEY4, val.facility.id, val.id], val)
                    .commit();
            }else{
                res = await kv.atomic()
                    .set([this.base, this.KEY, val.id], val)
                    .delete([this.base, this.KEY2, data.datetime, data.id])
                    .set([this.base, this.KEY2, val.datetime, val.id], val)
                    .set([this.base, this.KEY3, val.patient.id, val.id], val)
                    .delete([this.base, this.KEY4, data.facility.id, val.id])
                    .set([this.base, this.KEY4, val.facility.id, val.id], val)
                    .commit();
            }
        }else{
            if(data.patient.id){
                res = await kv.atomic()
                    .set([this.base, this.KEY, val.id], val)
                    .delete([this.base, this.KEY2, data.datetime, data.id])
                    .set([this.base, this.KEY2, val.datetime, val.id], val)
                    .delete([this.base, this.KEY3, data.patient.id, val.id])
                    .delete([this.base, this.KEY4, data.facility.id, val.id])
                    .set([this.base, this.KEY4, val.facility.id, val.id], val)
                    .commit();
            }else{
                res = await kv.atomic()
                    .set([this.base, this.KEY, val.id], val)
                    .delete([this.base, this.KEY2, data.datetime, data.id])
                    .set([this.base, this.KEY2, val.datetime, val.id], val)
                    .delete([this.base, this.KEY4, data.facility.id, val.id])
                    .set([this.base, this.KEY4, val.facility.id, val.id], val)
                    .commit();
            }
        }
        this.database.close();
        return res.ok;
    }
    async delete(val: Inquiry): Promise<void> {
        const data = await this.read(val.id);
        if(data){
            const kv = await this.database.open();
            if(data.patient.id){
                await kv.atomic()
                    .delete([this.base, this.KEY, val.id])
                    .delete([this.base, this.KEY2, data.datetime, val.id])
                    .delete([this.base, this.KEY3, data.patient.id, val.id])
                    .delete([this.base, this.KEY4, data.facility.id, val.id])
                    .commit();
            }else{
                await kv.atomic()
                    .delete([this.base, this.KEY, val.id])
                    .delete([this.base, this.KEY2, data.datetime, val.id])
                    .delete([this.base, this.KEY4, data.facility.id, val.id])
                    .commit();
            }
            this.database.close();
        }
    }
    async read(id: string): Promise<Inquiry|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Inquiry>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value && res.value && res.value.patient && res.value.facility){
            const repo = new PatientRepository(this.base);
            if(res.value.patient.id){
                const p = await repo.read(res.value.patient.id);
                if(p){
                    res.value.patient = p;
                }
            }
            const fservice = new FacilityService(new FacilityRepository(this.base));
            if(res.value.facility.id){
                const f = await fservice.get(res.value.facility.id);
                if(f){
                    res.value.facility = toFac(f);
                }
            }
            return res.value;
        }
        return undefined;
    }

    private buildCondition(cond: Condition): Deno.KvListSelector {
        if(cond.patientId){
            return {prefix: [this.base, this.KEY3, cond.patientId]};
        }else if(cond.facilityId){
            return {prefix: [this.base, this.KEY4, cond.facilityId]};
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

    async list(cond: Condition): Promise<Inquiry[]> {
        const key = this.buildCondition(cond);
        const kv = await this.database.open();
        let list: Inquiry[] = [];
        const res = kv.list<Inquiry>(key);
        if(res){
            for await (const r of res){
                list.push(r.value);
            }
        }
        if(cond.patientId && cond.facilityId){
            list = list.filter((val)=>val.facility.id === cond.facilityId);
        }
        if((cond.patientId || cond.facilityId) && (cond.fromDate || cond.toDate)){
            if(!cond.fromDate){
                cond.fromDate = "1900-01-01";
            }
            if(!cond.toDate){
                cond.toDate = "2999-12-31";
            }else{
                const toDate = cond.toDate;
                const t = new Date(toDate);
                t.setDate(t.getDate() + 1);
                cond.toDate = toDateString(t);
            }
            const t = [];
            for(const val of list){
                if(cond.fromDate <= val.datetime && val.datetime < cond.toDate){
                    t.push(val);
                }
            }
            list = t;
        }
        this.database.close();
        return list;
    }
}