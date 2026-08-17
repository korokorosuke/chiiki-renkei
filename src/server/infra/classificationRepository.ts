/// <reference lib="deno.unstable" />
import type { Classification } from "../domain/classification.ts"
import type { IClassificationRepository } from "../domain/classificationService.ts"
import { Kv } from "./kv.ts"

export class ClassificationRepository implements IClassificationRepository {
    database: Kv
    base: string
    KEY: string = "classification"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(d: Classification): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, d.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, d).commit();
        this.database.close();
        return res.ok;
    }
    async update(d: Classification): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, d.id], d);
        this.database.close();
        return res.ok;
    }
    async delete(d: Classification): Promise<void> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, d.id]);
        this.database.close();
    }
    async read(id: string): Promise<Classification|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Classification>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async all(): Promise<Classification[]> {
        const kv = await this.database.open();
        const list: Classification[] = [];
        const res = kv.list<Classification>({prefix: [this.base, this.KEY]});
        if(res){
            for await (const d of res){
                list.push(d.value);
            }
        }
        this.database.close();
        return list;
    }
}