/// <reference lib="deno.unstable" />
import type { Database } from "./database.ts"

export class Kv implements Database{
    private kv?: Deno.Kv

    static test = false

    async open(): Promise<Deno.Kv> {
        if(Kv.test){
            return this.openTest();
        }
        this.kv = await Deno.openKv("reco.db");
        return this.kv;
    }

    async openTest(): Promise<Deno.Kv> {
        this.kv = await Deno.openKv("test.db");
        return this.kv;
    }

    async openMemory(): Promise<Deno.Kv> {
        this.kv = await Deno.openKv(":memory:");
        return this.kv;
    }

    close(): void {
        this.kv?.close();
    }

    get(): Deno.Kv| undefined {
        return this.kv;
    }
}