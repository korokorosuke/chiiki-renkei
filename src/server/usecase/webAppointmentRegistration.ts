import { ID_EMPTY, DATE_EMPTY } from "../domain/webAppointmentService.ts"
import type { WebAppointment } from "../domain/webAppointment.ts"
import type { AppointmentRegistration } from "./appointmentRegistration.ts"
import { type FetchResult, type Result, ng, okWithData } from "../lib/response.ts"
import { toAppointment } from "../lib/types.ts"

export interface IWebAppointmentService{
    insert(val: WebAppointment): Promise<FetchResult<WebAppointment>>
    update(val: WebAppointment): Promise<FetchResult<WebAppointment>>
    delete(val: WebAppointment): Promise<Result>
    getRaw(id: string): Promise<WebAppointment|undefined>
}

export class WebAppointmentRegistration{
    private service: IWebAppointmentService
    private appusecase: AppointmentRegistration
    constructor(service: IWebAppointmentService, appusecase: AppointmentRegistration){
        this.service = service;
        this.appusecase = appusecase;
    }

    async insert(val: WebAppointment): Promise<FetchResult<WebAppointment>>{
        const res = await this.service.insert(val);
        if(res.ok){
            const app = res.data!;
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

    async update(val: WebAppointment): Promise<FetchResult<WebAppointment>>{
        const data = await this.service.getRaw(val.id);
        if(!data){
            return ng(["対象のデータが存在しません。"]);
        }
        const res = await this.service.update(val);
        if(res.ok){
            if(!data.patient.id){
                data.patient.id = ID_EMPTY;
            }
            if(!data.date){
                data.date = DATE_EMPTY;
            }
            const app = res.data!;
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
        const data = await this.service.getRaw(val.id);
        if(!data){
            return ng(["予約が見つかりませんでした。"]);
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
        const res = await this.service.update(val);
        if(res.ok){
            const app = res.data!;
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