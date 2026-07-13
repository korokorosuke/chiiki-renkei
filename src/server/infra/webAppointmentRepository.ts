/// <reference lib="deno.unstable" />
import type { WebAppointment, Condition } from "../domain/webAppointment.ts"
import type { IWebAppRepository } from "../domain/webAppointmentService.ts"
import { Kv } from "./kv.ts"
import { WebReservationRepository } from "./webReservationRepository.ts"
import { DATE_EMPTY } from "../domain/webAppointmentService.ts"
import { addDay } from "../lib/datetime.ts"

export class WebAppRepository implements IWebAppRepository {
    database: Kv
    base: string
    KEY: string = "webapp"
    KEY2: string = "wa_date"
    KEY3: string = "wa_fac"
    KEY4: string = "wa_pat"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(app: WebAppointment): Promise<boolean> {
        if(!app.facility.id){
            return false;
        }
        const repo = new WebReservationRepository(this.base);
        if(app.date === DATE_EMPTY || await repo.countUp(app.department.id, app.date, app.dr.id, app.time, false)){
            const key = [this.base, this.KEY, app.id];
            const kv = await this.database.open();
            const res = await kv.atomic().check({key, versionstamp: null})
                .set(key, app)
                .set([this.base, this.KEY2, app.date, app.id], app)
                .set([this.base, this.KEY3, app.facility.id, app.id], app)
                .set([this.base, this.KEY4, app.patient.id, app.id], app)
                .commit();
            this.database.close();
            if(!res.ok){
                await repo.countDown(app.department.id, app.date, app.dr.id, app.time);
            }
            return res.ok;
        }else{
            return false;
        }
    }
    async update(app: WebAppointment): Promise<boolean> {
        const data = await this.read(app.id);
        if(!data || !data.facility.id || !app.facility.id){
            return false;
        }

        const repo = new WebReservationRepository(this.base);
        if(app.date === DATE_EMPTY && data.date === DATE_EMPTY){
            //continue
        }else if(!app.dr.id){
            //continue
        }else if(app.date === DATE_EMPTY && data.date !== DATE_EMPTY){
            if(!await repo.countDown(data.department.id, data.date, data.dr.id, data.time)){
                return false;
            }
        }else if(data.date === DATE_EMPTY && app.date !== DATE_EMPTY){
            if(!await repo.countUp(app.department.id, app.date, app.dr.id, app.time, app.force)){
                return false;
            }
        }else if(data.department.id != app.department.id || data.date != app.date ||
            data.dr.id != app.dr.id || data.time != app.time){
            if(!await repo.countDown(data.department.id, data.date, data.dr.id, data.time)){
                return false;
            }
            if(!await repo.countUp(app.department.id, app.date, app.dr.id, app.time, app.force)){
                await repo.countUp(data.department.id, data.date, data.dr.id, data.time, data.force);
                return false;
            }
        }
        const kv = await this.database.open();
        let res;
        if(data.date === app.date){
            res = await kv.atomic()
                .set([this.base, this.KEY, app.id], app)
                .set([this.base, this.KEY2, app.date, app.id], app)
                .set([this.base, this.KEY3, app.facility.id, app.id], app)
                .delete([this.base, this.KEY4, data.patient.id, data.id])
                .set([this.base, this.KEY4, app.patient.id, app.id], app)
                .commit();
        }else{
            res = await kv.atomic()
                .set([this.base, this.KEY, app.id], app)
                .delete([this.base, this.KEY2, data.date, data.id])
                .set([this.base, this.KEY2, app.date, app.id], app)
                .set([this.base, this.KEY3, app.facility.id, app.id], app)
                .delete([this.base, this.KEY4, data.patient.id, data.id])
                .set([this.base, this.KEY4, app.patient.id, app.id], app)
                .commit();
        }
        this.database.close();
        return res.ok;
    }
    async delete(app: WebAppointment): Promise<void> {
        const data = await this.read(app.id);
        if(data){
            if(!data.cancel && data.date !== DATE_EMPTY && data.dr.id){
                const repo = new WebReservationRepository(this.base);
                if(!await repo.countDown(data.department.id, data.date, data.dr.id, data.time)){
                    return;
                }
            }
            const kv = await this.database.open();
            await kv.atomic()
                .delete([this.base, this.KEY, app.id])
                .delete([this.base, this.KEY2, data.date, app.id])
                .delete([this.base, this.KEY3, data.facility.id, app.id])
                .delete([this.base, this.KEY4, data.patient.id, data.id])
                .commit();
            this.database.close();
        }
    }
    async read(id: string): Promise<WebAppointment|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<WebAppointment>([this.base, this.KEY, id]);
        this.database.close();
        if(res && res.value){
            return res.value;
        }
        return undefined;
    }

    private buildCondition(cond: Condition): Deno.KvListSelector {
        if(cond.patientId){
            return {prefix: [this.base, this.KEY4, cond.patientId]};
        }else if(cond.facilityId){
            return {prefix: [this.base, this.KEY3, cond.facilityId]};
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

    async list(cond: Condition): Promise<WebAppointment[]> {
        const key = this.buildCondition(cond);
        const kv = await this.database.open();
        let list: WebAppointment[] = [];
        const res = kv.list<WebAppointment>(key);
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
                cond.toDate = addDay(cond.toDate);
            }
            const t = [];
            for(const val of list){
                if(cond.fromDate <= val.date && val.date < cond.toDate){
                    t.push(val);
                }
            }
            list = t;
        }
        this.database.close();
        return list;
    }
}