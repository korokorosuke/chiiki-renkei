/// <reference lib="deno.unstable" />
import type { Due } from "../domain/due.ts"
import type { IDueRepository } from "../domain/dueService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

export class DueRepository implements IDueRepository {
    database: Kv
    base: string
    KEY: string = "due"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(d: Due): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, d.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, d).commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(d: Due): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, d.id], d);
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(d: Due): Promise<boolean> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, d.id]);
        this.database.close();
        return true;
    }
    async read(id: number): Promise<Due|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Due>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async all(): Promise<Due[]> {
        const kv = await this.database.open();
        const list: Due[] = [];
        const res = kv.list<Due>({prefix: [this.base, this.KEY]});
        if(res){
            for await (const d of res){
                list.push(d.value);
            }
        }
        this.database.close();
        return list;
    }
}