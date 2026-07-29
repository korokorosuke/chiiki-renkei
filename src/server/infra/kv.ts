/// <reference lib="deno.unstable" />
import type { Database } from "./database.ts"
import { PRODUCTION_TYPE, DEV } from "../settings.ts"


export class Kv implements Database{
    private kv?: Deno.Kv

    static test = false

    async open(): Promise<Deno.Kv> {
        if(Kv.test){
            return this.openTest();
        }

        const dev = Deno.env.get(PRODUCTION_TYPE)
        if(dev === DEV){
          return this.openDev();
        }

        this.kv = await Deno.openKv();
        return this.kv;
    }

    async openDev(): Promise<Deno.Kv> {
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