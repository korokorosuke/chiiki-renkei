/// <reference lib="deno.unstable" />
import type { Dr } from "../domain/dr.ts"
import type { IDrRepository } from "../domain/drService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

export class DrRepository implements IDrRepository {
    database: Kv
    base: string
    KEY: string = "dr"
    KEY2: string = "dr_dept"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(d: Dr): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, d.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, d)
            .set([this.base, this.KEY2, d.department, d.id], d)
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(d: Dr): Promise<boolean> {
        const data = await this.read(d.id);
        if(!data){
            await fatal(`${this.constructor.name} update`, "データが存在しません", this.base);
            return false;
        }
        const kv = await this.database.open();
        let res: {ok: boolean};
        if(data.department === d.department){
            res = await kv.atomic()
                .set([this.base, this.KEY, d.id], d)
                .set([this.base, this.KEY2, d.department, d.id], d)
                .commit();
        }else{
            res = await kv.atomic()
                .set([this.base, this.KEY, d.id], d)
                .delete([this.base, this.KEY2, data.department, data.id])
                .set([this.base, this.KEY2, d.department, d.id], d)
                .commit();
        }
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(d: Dr): Promise<boolean> {
        const data = await this.read(d.id);
        if(!data){
            await fatal(`${this.constructor.name} delete`, "データが存在しません", this.base);
            return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic()
            .delete([this.base, this.KEY, d.id])
            .delete([this.base, this.KEY2, data.department, data.id])
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} delete`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async read(id: string): Promise<Dr|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Dr>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async list(dept: string): Promise<Dr[]> {
        const kv = await this.database.open();
        const list: Dr[] = [];
        const res = kv.list<Dr>({prefix: [this.base, this.KEY2, dept]});
        for await (const dr of res){
            list.push(dr.value);
        }
        this.database.close();
        return list;
    }
    async all(): Promise<Dr[]> {
        const kv = await this.database.open();
        const list: Dr[] = [];
        const res = kv.list<Dr>({prefix: [this.base, this.KEY2]});
        for await (const dr of res){
            list.push(dr.value);
        }
        this.database.close();
        return list;
    }
}