/// <reference lib="deno.unstable" />
import type { Appointment, Condition } from "../domain/appointment.ts"
import type { IAppointmentRepository } from "../domain/appointmentService.ts"
import { FacilityRepository } from "./facilityRepository.ts"
import { Kv } from "./kv.ts"
import { PatientRepository } from "./patientRepository.ts"
import { FacilityService } from "../domain/facilityService.ts"
import { toFac } from "../lib/types.ts"
import { addDay } from "../lib/datetime.ts"
import { fatal } from "../lib/log.ts"

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
            await fatal(`${this.constructor.name} insert`, "患者データが存在しません", this.base);
            return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, app)
            .set([this.base, this.KEY2, app.date, app.id], app)
            .set([this.base, this.KEY3, app.patient.id, app.id], app)
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(app: Appointment): Promise<boolean> {
        const data = await this.read(app.id);
        if(!data || !data.patient || !app.patient){
            await fatal(`${this.constructor.name} update`, "患者データが存在しません", this.base);
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
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(app: Appointment): Promise<boolean> {
        const data = await this.read(app.id);
        if(!data){
          await fatal(`${this.constructor.name} delete`, "データが存在しません", this.base);
          return false;
        }
        if(!data.patient){
            await fatal(`${this.constructor.name} delete`, "患者データが存在しません", this.base);
            return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic()
            .delete([this.base, this.KEY, app.id])
            .delete([this.base, this.KEY2, data.date, app.id])
            .delete([this.base, this.KEY3, data.patient.id, app.id])
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} delete`, "失敗しました", this.base);
        }
        return res.ok;
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

    async listForReport(date: string, facilityId: string, deptId: string): Promise<Appointment[]> {
        const kv = await this.database.open();
        const list: Appointment[] = [];
        const key = {prefix: [this.base, this.KEY2, date]};
        const res = kv.list<Appointment>(key);
        if(res){
            const fservice = new FacilityService(new FacilityRepository(this.base));
            for await (const r of res){
                if(facilityId && r.value.facility.id !== facilityId){
                    continue;
                }
                if(deptId && r.value.department.id !== deptId){
                    continue;
                }
                const f = await fservice.get(r.value.facility.id);
                if(f){
                    if(f.notSend){
                      continue;
                    }
                    if(f.faxSendNo){
                      r.value.facility.fax = f.faxSendNo;
                    }
                }
                list.push(r.value);
            }
        }
        this.database.close();
        return list;
    }
}