/// <reference lib="deno.unstable" />
import type { WebMaster } from "../domain/webMaster.ts"
import type { IWebMasterRepository } from "../domain/webMasterService.ts"
import { Kv } from "./kv.ts"

export class WebMasterRepository implements IWebMasterRepository {
    database: Kv
    base: string
    KEY: string = "webmaster"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(wr: WebMaster): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, wr.dept, wr.dr, wr.week];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, wr)
            .commit();
        this.database.close();
        return res.ok;
    }
    async update(wr: WebMaster): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.atomic()
            .set([this.base, this.KEY, wr.dept, wr.dr, wr.week], wr)
            .commit();
        this.database.close();
        return res.ok;
    }
    async delete(wr: WebMaster): Promise<void> {
        const kv = await this.database.open();
        await kv.atomic()
            .delete([this.base, this.KEY, wr.dept, wr.dr, wr.week])
            .commit();
        this.database.close();
    }
    async read(dept: string, dr: string, week: number): Promise<WebMaster|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<WebMaster>([this.base, this.KEY, dept, dr, week]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
}