import type { Appointment } from "../domain/appointment.ts"
import type { AnswerRegistration } from "./answerRegistration.ts"
import { type Result, type FetchResult, ng } from "../lib/response.ts"

export interface IAppointmentService{
    insert(val: Appointment): Promise<FetchResult<Appointment>>
    update(val: Appointment): Promise<FetchResult<Appointment>>
    delete(val: Appointment): Promise<Result>
}

export class AppointmentRegistration{
    private service: IAppointmentService
    private answercase: AnswerRegistration
    constructor(service: IAppointmentService,
        ansercase: AnswerRegistration
    ){
        this.service = service;
        this.answercase = ansercase;
    }

    async insert(app: Appointment): Promise<Result>{
        const res = await this.service.insert(app);
        if(res.ok){
            return await this.answercase.insert(app);
        }else{
            return ng(["予約の連携に失敗しました。管理者にお問い合わせください。"]);
        }
    }

    async update(app: Appointment): Promise<Result>{
        const res = await this.service.update(app);
        if(res.ok){
            return await this.answercase.update(app);
        }else{
            return ng(["予約の連携に失敗しました。管理者にお問い合わせください。"]);
        }
    }

    async delete(app: Appointment): Promise<Result>{
        const res = await this.service.delete(app);
        if(!res.ok){
            return await this.answercase.delete(app);
        }else{
            return ng(["予約の連携に失敗しました。管理者にお問い合わせください。"]);
        }
    }
}