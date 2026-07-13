/// <reference lib="deno.unstable" />
import type { WebNotice } from "../domain/webNotice.ts"
import type { IWebNoticeRepository } from "../domain/webNoticeService.ts"
import { Kv } from "./kv.ts"

export class WebNoticeRepository implements IWebNoticeRepository {
    database: Kv
    base: string
    KEY: string = "webnotice"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(val: WebNotice): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, val.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, val)
            .commit();
        this.database.close();
        return res.ok;
    }
    async update(val: WebNotice): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.atomic()
            .set([this.base, this.KEY, val.id], val)
            .commit();
        this.database.close();
        return res.ok;
    }
    async delete(val: WebNotice): Promise<void> {
        const kv = await this.database.open();
        await kv.atomic()
            .delete([this.base, this.KEY, val.id])
            .commit();
        this.database.close();
    }
    async read(id: string): Promise<WebNotice|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<WebNotice>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async list(date?: string): Promise<WebNotice[]> {
        const kv = await this.database.open();
        const res = kv.list<WebNotice>({prefix: [this.base, this.KEY]});
        const list: WebNotice[] = [];
        for await (const val of res){
            if(date){
                if(val.value.fromDate <= date && date <= val.value.toDate){
                    list.push(val.value);
                }
            }else{
                list.push(val.value);
            }
        }
        this.database.close();
        return list;
    }
}