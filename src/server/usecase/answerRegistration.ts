import { type Answer, initialize } from "../domain/answer.ts"
import type { AnswerPasswordService } from "../domain/answerService.ts"
import type { Questionnaire } from "../domain/questionnaire.ts"
import type { Appointment } from "../domain/appointment.ts"
import { type Result, ok, ng } from "../lib/response.ts"

export interface IAnswerService{
    insert(val: Answer): Promise<Result>
    update(val: Answer): Promise<Result>
    delete(val: Answer): Promise<Result>
    getList(appId: string): Promise<Answer[]>
    getPasswordService(): AnswerPasswordService
}

export interface IQuestionnaireService{
    getListByDept(dept: string): Promise<Questionnaire[]>
}

export class AnswerRegistration{
    private service: IAnswerService
    private qservice: IQuestionnaireService
    constructor(service: IAnswerService, qservice: IQuestionnaireService){
        this.service = service;
        this.qservice = qservice;
    }

    async createPassword(appId: string): Promise<Result>{
        const service = this.service.getPasswordService();
        const ap = await service.create(appId);
        return await service.insert(ap);
    }

    async insert(app: Appointment): Promise<Result>{
        const qs = await this.qservice.getListByDept(app.department.id);
        if(qs.length > 0){
            for await(const q of qs){
                const a = initialize();
                a.appointmentId = app.id;
                a.appointmentDate = app.date;
                a.questionnaire = q;
                const res = await this.service.insert(a);
                if(!res.ok){
                    return res;
                }
            }
            await this.createPassword(app.id);
        }
        return ok();
    }

    async update(app: Appointment): Promise<Result>{
        let qs = await this.qservice.getListByDept(app.department.id);
        let as = await this.service.getList(app.id);
        if(as.length > 0){
            for await(const a of as){
                if(!a.inputDate){
                    await this.service.delete(a);
                }else{
                    if(a.appointmentDate !== app.date){
                        a.appointmentDate = app.date;
                        const res = await this.service.update(a);
                        if(!res.ok){
                            return res;
                        }
                    }
                }
            }
            as = as.filter((a: Answer) => a.inputDate);
            qs = qs.filter((q: Questionnaire) => {
                return !as.some((a: Answer) => a.questionnaire.id === q.id);
            });
        }
        for await(const q of qs){
            const a = initialize();
            a.appointmentId = app.id;
            a.appointmentDate = app.date;
            a.questionnaire = q;
            const res = await this.service.insert(a);
            if(!res.ok){
                return res;
            }
        }
        return ok();
    }

    async delete(app: Appointment): Promise<Result>{
        let result = ok();
        for await(const ans of (await this.service.getList(app.id))){
            if(!ans.inputDate){
                const res = await this.service.delete(ans);
                if(!res.ok){
                    if(result.ok){
                        result = ng(res.errors);
                    }else{
                        result.errors = [...result.errors, ...res.errors];
                    }
                }
            }
        }
        const service = this.service.getPasswordService();
        const ap = await service.get(app.id);
        if(ap){
            const res = await service.delete(ap);
            if(!res.ok){
                if(result.ok){
                    result = ng(res.errors);
                }else{
                    result.errors = [...result.errors, ...res.errors];
                }
            }
        }
        return result;
    }
}