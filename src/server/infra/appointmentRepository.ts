/// <reference lib="deno.unstable" />
import type { Appointment, Condition } from "../domain/appointment.ts"
import type { IAppointmentRepository } from "../domain/appointmentService.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { Kv } from "./kv.ts"
import { PatientRepository } from "./patientRepository.ts"
import { FacilityService } from "../domain/facilityService.ts"
import { toFac } from "../lib/types.ts"
import { addDay } from "../lib/datetime.ts"

export class AppointmentRepository implements IAppointmentRepository {
    database: Kv
    base: string
    KEY: string = "appointment"
    KEY2: string = "app_date"
    KEY3: string = "app_pat"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(app: Appointment): Promise<boolean> {
        const key = [this.base, this.KEY, app.id];
        if(!app.patient){
            return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, app)
            .set([this.base, this.KEY2, app.date, app.id], app)
            .set([this.base, this.KEY3, app.patient.id, app.id], app)
            .commit();
        this.database.close();
        return res.ok;
    }
    async update(app: Appointment): Promise<boolean> {
        const data = await this.read(app.id);
        if(!data || !data.patient || !app.patient){
            return false;
        }
        const kv = await this.database.open();
        let res;
        if(data.date === app.date){
            res = await kv.atomic()
                .set([this.base, this.KEY, app.id], app)
                .set([this.base, this.KEY2, app.date, app.id], app)
                .set([this.base, this.KEY3, app.patient.id, app.id], app)
                .commit();
        }else{
            res = await kv.atomic()
                .set([this.base, this.KEY, app.id], app)
                .delete([this.base, this.KEY2, data.date, data.id])
                .set([this.base, this.KEY2, app.date, app.id], app)
                .set([this.base, this.KEY3, app.patient.id, app.id], app)
                .commit();
        }
        this.database.close();
        return res.ok;
    }
    async delete(app: Appointment): Promise<void> {
        const data = await this.read(app.id);
        if(data){
            const kv = await this.database.open();
            if(!data.patient){
                return;
            }
            await kv.atomic()
                .delete([this.base, this.KEY, app.id])
                .delete([this.base, this.KEY2, data.date, app.id])
                .delete([this.base, this.KEY3, data.patient.id, app.id])
                .commit();
            this.database.close();
        }
    }
    async read(id: string): Promise<Appointment|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Appointment>([this.base, this.KEY, id]);
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

    async list(cond: Condition): Promise<Appointment[]> {
        const key = this.buildCondition(cond);
        const kv = await this.database.open();
        const list: Appointment[] = [];
        const res = kv.list<Appointment>(key);
        if(res){
            for await (const r of res){
                list.push(r.value);
            }
        }
        this.database.close();
        return list;
    }
}