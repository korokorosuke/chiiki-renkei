/// <reference lib="deno.unstable" />
import type { Answer } from "../domain/answer.ts"
import type { IAnswerRepository } from "../domain/answerService.ts"
import { Kv } from "./kv.ts"
import { AppointmentRepository } from "./appointmentRepository.ts"
import { fatal } from "../lib/log.ts"

export class AnswerRepository implements IAnswerRepository {
    database: Kv
    base: string
    KEY: string = "answer"
    KEY_APP: string = "answer_app"
    KEY_PAT: string = "answer_pat"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async getPatientId(a: Answer): Promise<string|undefined>{
        const appRepo = new AppointmentRepository(this.base);
        const app = await appRepo.read(a.appointmentId);
        if(!app){
            return undefined;
        }
        return app.patient.id;
    }
    async insert(a: Answer): Promise<boolean> {
        const patId = await this.getPatientId(a);
        if(!patId){
            await fatal(`${this.constructor.name} insert`, "患者IDを取得できませんでした", this.base);
            return false;
        }
        const kv = await this.database.open();
        const key = [this.base, this.KEY, a.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, a)
            .set([this.base, this.KEY_APP, a.appointmentId, a.id], a)
            .set([this.base, this.KEY_PAT, patId, a.id], a)
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(a: Answer): Promise<boolean> {
        const patId = await this.getPatientId(a);
        if(!patId){
            await fatal(`${this.constructor.name} update`, "患者IDを取得できませんでした", this.base);
            return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic()
            .set([this.base, this.KEY, a.id], a)
            .set([this.base, this.KEY_APP, a.appointmentId, a.id], a)
            .set([this.base, this.KEY_PAT, patId, a.id], a)
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(a: Answer): Promise<boolean> {
        const patId = await this.getPatientId(a);
        const kv = await this.database.open();
        let res;
        if(patId){
            res = await kv.atomic()
                .delete([this.base, this.KEY, a.id])
                .delete([this.base, this.KEY_APP, a.appointmentId, a.id])
                .delete([this.base, this.KEY_PAT, patId, a.id])
                .commit();
        }else{
            res = await kv.atomic()
                .delete([this.base, this.KEY, a.id])
                .delete([this.base, this.KEY_APP, a.appointmentId, a.id])
                .commit();
        }
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} delete`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async read(id: string): Promise<Answer|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Answer>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async list(appId: string): Promise<Answer[]> {
        const kv = await this.database.open();
        const list: Answer[] = [];
        const res = kv.list<Answer>({prefix: [this.base, this.KEY_APP, appId]});
        if(res){
            for await (const a of res){
                list.push(a.value);
            }
        }
        this.database.close();
        return list;
    }
    async listByPatient(patientId: string): Promise<Answer[]> {
        const kv = await this.database.open();
        const list: Answer[] = [];
        const res = kv.list<Answer>({prefix: [this.base, this.KEY_PAT, patientId]});
        if(res){
            for await (const a of res){
                list.push(a.value);
            }
        }
        this.database.close();
        return list;
    }
}