/// <reference lib="deno.unstable" />
import type { WebReservation } from "../domain/webReservation.ts"
import type { IWebReservationRepository } from "../domain/webReservationService.ts"
import { Kv } from "./kv.ts"

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
            return res.ok;
        }else{
            this.database.close();
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
            return res.ok;
        }else{
            this.database.close();
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
        return res.ok;
    }
    async update(r: WebReservation): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.atomic()
            .set([this.base, this.KEY, r.dept, r.date, r.dr, r.time], r)
            .commit();
        this.database.close();
        return res.ok;
    }
    async delete(r: WebReservation): Promise<void> {
        const kv = await this.database.open();
        await kv.atomic()
            .delete([this.base, this.KEY, r.dept, r.date, r.dr, r.time])
            .commit();
        this.database.close();
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