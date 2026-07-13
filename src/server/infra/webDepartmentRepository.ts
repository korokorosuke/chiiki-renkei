/// <reference lib="deno.unstable" />
import type { WebDepartment } from "../domain/webDepartment.ts"
import type { IWebDepartmentRepository } from "../domain/webDepartmentService.ts"
import { Kv } from "./kv.ts"

export class WebDepartmentRepository implements IWebDepartmentRepository {
    database: Kv
    base: string
    KEY: string = "webdept"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(d: WebDepartment): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, d.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, d).commit();
        this.database.close();
        return res.ok;
    }
    async update(d: WebDepartment): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, d.id], d);
        this.database.close();
        return res.ok;
    }
    async delete(d: WebDepartment): Promise<void> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, d.id]);
        this.database.close();
    }
    async read(id: string): Promise<WebDepartment|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<WebDepartment>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async all(): Promise<WebDepartment[]> {
        const kv = await this.database.open();
        const list: WebDepartment[] = [];
        const res = kv.list<WebDepartment>({prefix: [this.base, this.KEY]});
        if(res){
            for await (const d of res){
                list.push(d.value);
            }
        }
        this.database.close();
        return list;
    }
}