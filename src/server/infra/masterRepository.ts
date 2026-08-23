/// <reference lib="deno.unstable" />
import type { IMasterRepository } from "../domain/masterService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

export class MasterRepository implements IMasterRepository {
    database: Kv
    base: string

    KEY_KIND: string = "kind"
    KEY_POST: string = "post"
    KEY_FACDEPT: string = "facdept"
    KEY_MEANS: string = "means"
    KEY_PURPOSE: string = "purpose"

    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async update(key: string, value: string[]): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, key], value);
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async read(key: string): Promise<string[]|undefined> {
        if(key === this.KEY_KIND || key === this.KEY_POST ||
                key === this.KEY_FACDEPT || key === this.KEY_MEANS ||
                key === this.KEY_PURPOSE){
            const kv = await this.database.open();
            const res = await kv.get<string[]>([this.base, key]);
            this.database.close();
            if(res?.value){
                return res.value;
            }
        }
        return undefined;
    }
}