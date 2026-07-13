import type { Appointment } from "../domain/appointment.ts"
import type { AnswerRegistration } from "./answerRegistration.ts"
import { type Result, type FetchResult, ok, ng } from "../lib/response.ts"

export interface IAppointmentService{
    insert(val: Appointment): Promise<FetchResult<Appointment>>
    update(val: Appointment): Promise<FetchResult<Appointment>>
    delete(val: Appointment): Promise<void>
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
            await this.answercase.insert(app);
            return ok();
        }else{
            return ng(["予約の連携に失敗しました。管理者にお問い合わせください。"]);
        }
    }

    async update(app: Appointment): Promise<Result>{
        const res = await this.service.update(app);
        if(res.ok){
            await this.answercase.update(app);
            return ok();
        }else{
            return ng(["予約の連携に失敗しました。管理者にお問い合わせください。"]);
        }
    }

    async delete(app: Appointment): Promise<void>{
        await this.answercase.delete(app);
        await this.service.delete(app);
    }
}