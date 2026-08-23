/// <reference lib="deno.unstable" />
import type { Department } from "../domain/department.ts"
import type { IDepartmentRepository } from "../domain/departmentService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

export class DepartmentRepository implements IDepartmentRepository {
    database: Kv
    base: string
    KEY: string = "department"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(d: Department): Promise<boolean> {
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
    async update(d: Department): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, d.id], d);
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(d: Department): Promise<boolean> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, d.id]);
        this.database.close();
        return true;
    }
    async read(id: string): Promise<Department|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Department>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async all(): Promise<Department[]> {
        const kv = await this.database.open();
        const list: Department[] = [];
        const res = kv.list<Department>({prefix: [this.base, this.KEY]});
        if(res){
            for await (const d of res){
                list.push(d.value);
            }
        }
        this.database.close();
        return list;
    }
    async exam(): Promise<Department[]> {
        const kv = await this.database.open();
        const list: Department[] = [];
        const res = kv.list<Department>({prefix: [this.base, this.KEY]});
        if(res){
            for await (const d of res){
                if(d.value.exam){
                    list.push(d.value);
                }
            }
        }
        this.database.close();
        return list;
    }
}