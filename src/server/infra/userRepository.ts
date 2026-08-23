/// <reference lib="deno.unstable" />
import type { AuthUser, Condition } from "../domain/user.ts"
import type { IUserRepository } from "../domain/userService.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

export class UserRepository implements IUserRepository {
    database: Kv
    base: string
    KEY: string = "user"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(u: AuthUser): Promise<boolean> {
        const kv = await this.database.open();
        const key = [this.base, this.KEY, u.id];
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, u)
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(u: AuthUser): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, u.id], u);
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(u: AuthUser): Promise<boolean> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, u.id]);
        this.database.close();
        return true;
    }
    async read(id: string): Promise<AuthUser|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<AuthUser>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return undefined;
    }
    async list(cond: Condition): Promise<AuthUser[]> {
        const kv = await this.database.open();
        const list: AuthUser[] = [];
        const res = kv.list<AuthUser>({prefix: [this.base, this.KEY]});
        if(res){
            for await (const u of res){
                if(u.value.name.indexOf(cond.name) >= 0){
                    list.push(u.value);
                }
            }
        }
        this.database.close();
        return list;
    }
}