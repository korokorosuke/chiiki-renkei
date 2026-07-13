/// <reference lib="deno.unstable" />
import type { Questionnaire } from "../domain/questionnaire.ts"
import type { IQuestionnaireRepository } from "../domain/questionnaireService.ts"
import { Kv } from "./kv.ts"

export class QuestionnaireRepository implements IQuestionnaireRepository {
    database: Kv
    base: string
    KEY: string = "questionnaire"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(q: Questionnaire): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, q.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, q).commit();
        this.database.close();
        return res.ok;
    }
    async update(q: Questionnaire): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, q.id], q);
        this.database.close();
        return res.ok;
    }
    async delete(q: Questionnaire): Promise<void> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, q.id]);
        this.database.close();
    }
    async read(id: string): Promise<Questionnaire|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Questionnaire>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async list(): Promise<Questionnaire[]> {
        const kv = await this.database.open();
        const list: Questionnaire[] = [];
        const res = kv.list<Questionnaire>({prefix: [this.base, this.KEY]});
        if(res){
            for await (const q of res){
                list.push(q.value);
            }
        }
        this.database.close();
        return list;
    }
}