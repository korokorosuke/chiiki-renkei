/// <reference lib="deno.unstable" />
import type { WebDr } from "../domain/webDr.ts"
import type { IWebDrRepository } from "../domain/webDrService.ts"
import { Kv } from "./kv.ts"

export class WebDrRepository implements IWebDrRepository {
    database: Kv
    base: string
    KEY: string = "webdr"
    KEY2: string = "webdr_dept"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(d: WebDr): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, d.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, d)
            .set([this.base, this.KEY2, d.department, d.id], d)
            .commit();
        this.database.close();
        return res.ok;
    }
    async update(d: WebDr): Promise<boolean> {
        const data = await this.read(d.id);
        const kv = await this.database.open();
        let res = {ok: false};
        if(data){
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
        }
        this.database.close();
        return res.ok;
    }
    async delete(d: WebDr): Promise<void> {
        const data = await this.read(d.id);
        const kv = await this.database.open();
        if(data){
            await kv.atomic()
                .delete([this.base, this.KEY, d.id])
                .delete([this.base, this.KEY2, data.department, data.id])
                .commit();
        }
        this.database.close();
    }
    async read(id: string): Promise<WebDr|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<WebDr>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async list(dept: string): Promise<WebDr[]> {
        const kv = await this.database.open();
        const list: WebDr[] = [];
        const res = kv.list<WebDr>({prefix: [this.base, this.KEY2, dept]});
        for await (const dr of res){
            list.push(dr.value);
        }
        this.database.close();
        return list;
    }
    async all(): Promise<WebDr[]> {
        const kv = await this.database.open();
        const list: WebDr[] = [];
        const res = kv.list<WebDr>({prefix: [this.base, this.KEY2]});
        for await (const dr of res){
            list.push(dr.value);
        }
        this.database.close();
        return list;
    }
}