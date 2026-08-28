/// <reference lib="deno.unstable" />
import type { WebNotice, NOTICE_PAGE } from "../domain/webNotice.ts"
import type { IWebNoticeRepository } from "../domain/webNoticeService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

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
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(val: WebNotice): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, val.id], val);
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(val: WebNotice): Promise<boolean> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, val.id]);
        this.database.close();
        return true;
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
    async all(): Promise<WebNotice[]> {
        const kv = await this.database.open();
        const res = kv.list<WebNotice>({prefix: [this.base, this.KEY]});
        const list: WebNotice[] = [];
        for await (const val of res){
            list.push(val.value);
        }
        this.database.close();
        list.sort((a, b) => b.fromDate.localeCompare(a.fromDate));
        return list;
    }
    async list(page: NOTICE_PAGE, date: string): Promise<WebNotice[]> {
        const kv = await this.database.open();
        const res = kv.list<WebNotice>({prefix: [this.base, this.KEY]});
        const list: WebNotice[] = [];
        for await (const val of res){
            if(page === val.value.page &&
                    val.value.fromDate <= date && date <= val.value.toDate){
                list.push(val.value);
            }
        }
        this.database.close();
        list.sort((a, b) => b.fromDate.localeCompare(a.fromDate));
        return list;
    }
}