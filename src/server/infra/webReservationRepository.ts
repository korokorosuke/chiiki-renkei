/// <reference lib="deno.unstable" />
import type { WebReservation } from "../domain/webReservation.ts"
import type { IWebReservationRepository } from "../domain/webReservationService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

export class WebReservationRepository implements IWebReservationRepository {
    database: Kv
    base: string
    KEY: string = "webreserv"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }

    async countUp(dept: string, date: string, dr: string, time: string, force: boolean|undefined): Promise<boolean>{
        const kv = await this.database.open();
        const data = await kv.get<WebReservation>([this.base, this.KEY, dept, date, dr, time]);
        if(data && data.value && (data.value.max - data.value.cnt > 0 || force)){
            data.value.cnt += 1;
            const res = await kv.atomic()
                .check(data)
                .set([this.base, this.KEY, dept, date, dr, time], data.value)
                .commit();
            this.database.close();
            if(!res.ok){
                await fatal(`${this.constructor.name} countUp`, "失敗しました", this.base);
            }
            return res.ok;
        }else{
            this.database.close();
            await fatal(`${this.constructor.name} countUp`, "枠が存在しません", this.base);
            return false;
        }
    }

    async countDown(dept: string, date: string, dr: string, time: string): Promise<boolean>{
        const kv = await this.database.open();
        const data = await kv.get<WebReservation>([this.base, this.KEY, dept, date, dr, time]);
        if(data && data.value && data.value.cnt > 0){
            data.value.cnt -= 1;
            const res = await kv.atomic()
                .check(data)
                .set([this.base, this.KEY, dept, date, dr, time], data.value)
                .commit();
            this.database.close();
            if(!res.ok){
                await fatal(`${this.constructor.name} countDown`, "失敗しました", this.base);
            }
            return res.ok;
        }else{
            this.database.close();
            await fatal(`${this.constructor.name} countDown`, "枠が存在しません", this.base);
            return false;
        }
    }

    async insert(r: WebReservation): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, r.dept, r.date, r.dr, r.time];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, r)
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(r: WebReservation): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, r.dept, r.date, r.dr, r.time], r);
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(r: WebReservation): Promise<boolean> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, r.dept, r.date, r.dr, r.time]);
        this.database.close();
        return true;
    }
    async read(dept: string, dr: string, date: string, time: string): Promise<WebReservation|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<WebReservation>([this.base, this.KEY, dept, date, dr, time]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async list(dept: string, dr: string, date: string): Promise<WebReservation[]> {
        const kv = await this.database.open();
        const list: WebReservation[] = [];
        const res = kv.list<WebReservation>({prefix: [this.base, this.KEY, dept, date, dr]});
        for await (const reserv of res){
            list.push(reserv.value);
        }
        this.database.close();
        return list;
    }
    async listByDate(dept: string, date: string): Promise<WebReservation[]> {
        const kv = await this.database.open();
        const list: WebReservation[] = [];
        const res = kv.list<WebReservation>(
            {start: [this.base, this.KEY, dept, date + "-01"], end: [this.base, this.KEY, dept, date + "-32"]});
        for await (const reserv of res){
            list.push(reserv.value);
        }
        this.database.close();
        return list;
    }
}