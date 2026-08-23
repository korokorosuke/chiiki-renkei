/// <reference lib="deno.unstable" />
import type { Patient, Condition } from "../domain/patient.ts"
import type { IPatientRepository } from "../domain/patientService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

export class PatientRepository implements IPatientRepository {
    database: Kv
    base: string
    KEY: string = "patient"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(p: Patient): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, p.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, p).commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(p: Patient): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, p.id], p);
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(p: Patient): Promise<boolean> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, p.id]);
        this.database.close();
        return true;
    }
    async read(id: string): Promise<Patient|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Patient>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async list(cond: Condition): Promise<Patient[]> {
        const kv = await this.database.open();
        const list: Patient[] = [];
        const res = kv.list<Patient>({prefix: [this.base, this.KEY]});
        if(res){
            for await (const p of res){
                if((p.value.lastName + "　" + p.value.firstName).indexOf(cond.name) >= 0 ||
                    (p.value.lastKana + "　" + p.value.firstKana).indexOf(cond.name) >= 0){
                    list.push(p.value);
                }
            }
        }
        this.database.close();
        return list;
    }
}