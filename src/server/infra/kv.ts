/// <reference lib="deno.unstable" />
import type { Database } from "./database.ts"
import { PRODUCTION_TYPE, DEV, DB_URL } from "../settings.ts"


export class Kv implements Database{
    private kv?: Deno.Kv

    static test = false

    async open(): Promise<Deno.Kv> {
        if(Kv.test){
            return this.openTest();
        }

        const path = Deno.env.get(DB_URL)
        const dev = Deno.env.get(PRODUCTION_TYPE)
        if(dev === DEV){
          return this.openDev(path);
        }

        if(path && path !== ""){
          this.kv = await Deno.openKv(path);
        }else{
          this.kv = await Deno.openKv();
        }
        return this.kv;
    }

    async openDev(path: string|undefined): Promise<Deno.Kv> {
      if(path){
        this.kv = await Deno.openKv("zdev_" + path);
      }else{
        this.kv = await Deno.openKv("zdev_reco.db");
      }
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