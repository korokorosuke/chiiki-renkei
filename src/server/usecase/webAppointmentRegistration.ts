import { ID_EMPTY, DATE_EMPTY } from "../domain/webAppointmentService.ts"
import type { WebAppointment } from "../domain/webAppointment.ts"
import type { AppointmentRegistration } from "./appointmentRegistration.ts"
import { type FetchResult, type Result, ok, ng, okWithData } from "../lib/response.ts"
import { toAppointment, FatalError } from "../lib/types.ts"

export interface IWebAppointmentService{
    insert(val: WebAppointment): Promise<FetchResult<WebAppointment>>
    update(val: WebAppointment): Promise<FetchResult<WebAppointment>>
    delete(val: WebAppointment): Promise<Result>
    getRaw(id: string): Promise<WebAppointment|undefined>
}

export interface IWebReservationService{
    countUp(dept: string, date: string, dr: string, time: string, force?: boolean): Promise<boolean>
    countDown(dept: string, date: string, dr: string, time: string, force?: boolean): Promise<boolean>
}

export class WebAppointmentRegistration{
    constructor(private service: IWebAppointmentService, private appusecase: AppointmentRegistration,
        private rService: IWebReservationService){}

    convertToEmpty(val: WebAppointment): WebAppointment{
        if(!val.patient.id){
            val.patient.id = ID_EMPTY;
        }
        if(!val.date){
            val.date = DATE_EMPTY;
        }
        return val;
    }

    async insert(val: WebAppointment): Promise<FetchResult<WebAppointment>>{
        if(!val.facility.id){
            throw new FatalError(`update ${this.constructor.name}`, "施設が存在しません。\n" + JSON.stringify(val));
        }
        val = this.convertToEmpty(val);
        if(val.date !== DATE_EMPTY &&
                !(await this.rService.countUp(val.department.id, val.date, val.dr.id, val.time, false))){
            return ng(["予約枠の空きがありません。"]);
        }

        const res = await this.service.insert(val);
        if(res.ok){
            const app = res.data;
            if(app.patient.id == ID_EMPTY || app.date === DATE_EMPTY){
                return okWithData<WebAppointment>(app);
            }
            const resapp = await this.appusecase.insert(toAppointment(app));
            if(resapp.ok){
                return okWithData<WebAppointment>(app);
            }else{
                return resapp;
            }
        }else{
            return res;
        }
    }

    async changeAppCount(val: WebAppointment, data: WebAppointment): Promise<Result>{
        val = this.convertToEmpty(val);
        data = this.convertToEmpty(data);
        if(val.date === DATE_EMPTY && data.date === DATE_EMPTY){
            //continue
        }else if(!val.dr.id){
            //continue
        }else if(val.date === DATE_EMPTY && data.date !== DATE_EMPTY){
            if(!await this.rService.countDown(data.department.id, data.date, data.dr.id, data.time)){
                throw new FatalError(`update ${this.constructor.name}`, "枠数の更新に失敗しました。\n" + JSON.stringify(data));
            }
        }else if(data.date === DATE_EMPTY && val.date !== DATE_EMPTY){
            if(!await this.rService.countUp(val.department.id, val.date, val.dr.id, val.time, val.force)){
                return ng(["予約枠の空きがありません。"]);
            }
        }else if(data.department.id != val.department.id || data.date != val.date ||
                data.dr.id != val.dr.id || data.time != val.time){
            if(!await this.rService.countUp(val.department.id, val.date, val.dr.id, val.time, val.force)){
                return ng(["予約枠の空きがありません。"]);
            }
            if(!await this.rService.countDown(data.department.id, data.date, data.dr.id, data.time)){
                throw new FatalError(`update ${this.constructor.name}`, "枠数の更新に失敗しました。\n" + JSON.stringify(data));
            }
        }
        return ok();
    }

    async update(val: WebAppointment): Promise<FetchResult<WebAppointment>>{
        if(!val.facility.id){
            throw new FatalError(`update ${this.constructor.name}`, "施設が存在しません。\n" + JSON.stringify(val));
        }
        let data = await this.service.getRaw(val.id);
        if(!data){
            throw new FatalError(`update ${this.constructor.name}`, "対象のデータが存在しません。\n" + JSON.stringify(val));
        }

        const r = await this.changeAppCount(val, data);
        if(!r.ok){
            return r;
        }
        const res = await this.service.update(val);
        if(res.ok){
            data = this.convertToEmpty(data);
            const app = res.data;
            if(data.patient.id !== ID_EMPTY && data.date !== DATE_EMPTY &&
                    app.patient.id !== ID_EMPTY && app.date !== DATE_EMPTY){
                if(app.patient.id !== data.patient.id){
                    await this.appusecase.delete(toAppointment(data));
                    const resapp = await this.appusecase.insert(toAppointment(app));
                    if(!resapp.ok){
                        return resapp;
                    }
                }else{
                    const resapp = await this.appusecase.update(toAppointment(app));
                    if(!resapp.ok){
                        return resapp;
                    }
                }
            }else if(data.patient.id !== ID_EMPTY && data.date !== DATE_EMPTY &&
                    (app.patient.id === ID_EMPTY || app.date === DATE_EMPTY)){
                await this.appusecase.delete(toAppointment(data));
            }else if((data.patient.id === ID_EMPTY || data.date === DATE_EMPTY) &&
                    (app.patient.id !== ID_EMPTY && app.date !== DATE_EMPTY)){
                const resapp = await this.appusecase.insert(toAppointment(app));
                if(!resapp.ok){
                    return resapp;
                }
            }
            return okWithData<WebAppointment>(app);
        }else{
            return res;
        }
    }

    async delete(val: WebAppointment): Promise<Result>{
        let data = await this.service.getRaw(val.id);
        if(!data){
            return ng(["予約が見つかりませんでした。"]);
        }
        data = this.convertToEmpty(data);
        if(!data.cancel && data.date !== DATE_EMPTY && data.dr.id){
            if(!await this.rService.countDown(data.department.id, data.date, data.dr.id, data.time)){
                throw new FatalError(`delete ${this.constructor.name}`, "枠数の更新に失敗しました。\n" + JSON.stringify(data));
            }
        }
        const result = await this.service.delete(val);
        if(result.ok){
            if(data && data.patient.id !== ID_EMPTY && data.date !== DATE_EMPTY){
                return await this.appusecase.delete(toAppointment(data));
            }
        }
        return result;
    }

    async cancel(val: WebAppointment): Promise<FetchResult<WebAppointment>>{
        const data = await this.service.getRaw(val.id);
        if(!data){
            return ng(["予約が見つかりませんでした。"]);
        }
        const r = await this.changeAppCount(val, data);
        if(!r.ok){
            return r;
        }
        const res = await this.service.update(val);
        if(res.ok){
            const app = res.data;
            if(app.patient.id == ID_EMPTY || app.date === DATE_EMPTY){
                return okWithData<WebAppointment>(app);
            }
            await this.appusecase.delete(toAppointment(app));
            return okWithData<WebAppointment>(app);
        }else{
            return res;
        }
    }
}