/// <reference lib="deno.unstable" />
import type { IAuthRepository } from "../domain/authService.ts"
import { Kv } from "./kv.ts"

export class AuthRepository implements IAuthRepository {
    database: Kv
    base: string
    KEY: string = "auth"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async update(user: string, token: string): Promise<boolean> {
        const kv = await this.database.open();
        const res = await kv.set([this.base, this.KEY, user], token);
        this.database.close();
        return res.ok;
    }
    async delete(user: string): Promise<void> {
        const kv = await this.database.open();
        await kv.delete([this.base, this.KEY, user]);
        this.database.close();
    }
    async read(id: string): Promise<string> {
        const kv = await this.database.open();
        const res = await kv.get<string>([this.base, this.KEY, id]);
        this.database.close();
        if(res?.value){
            return res.value;
        }
        return "";
    }
}