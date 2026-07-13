/// <reference lib="deno.unstable" />
import type { AnswerPassword } from "../domain/answer.ts"
import type { IAnswerPasswordRepository } from "../domain/answerService.ts"
import { Kv } from "./kv.ts"

export class AnswerPasswordRepository implements IAnswerPasswordRepository {
    database: Kv
    base: string
    KEY: string = "answer_password"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(a: AnswerPassword): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, a.appointmentId];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, a)
            .commit();
        this.database.close();
        return res.ok;
    }
    async update(a: AnswerPassword): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, a.appointmentId], a);
        this.database.close();
        return res.ok;
    }
    async delete(a: AnswerPassword): Promise<void> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, a.appointmentId]);
        this.database.close();
    }
    async read(appId: string): Promise<AnswerPassword|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<AnswerPassword>([this.base, this.KEY, appId]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async countUp(appId: string): Promise<boolean> {
        const ap = await this.read(appId);
        if(ap){
            ap.failCount = ap.failCount + 1;
            const kv = await this.database.open();
            const key = [this.base, this.KEY, appId];
            const res = await kv.set(key, ap);
            if(res.ok){
                this.database.close();
                return true;
            }
        }
        return false;
    }
}