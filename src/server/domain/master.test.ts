import { describe, test, expect } from "vitest"
import { MasterRepository } from "../infra/masterRepository.ts"
import { MasterService } from "./masterService.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

const data = ["あああ","いいい","ううう"];
const data2 = ["あああ","いいい","うううう"];
const data3 = ["あああ","いいい","うううう","えええ"];

Kv.test = true;

describe("master service", () => {
    test("prepare", async () => {
      const kv = new Kv();
      const con = await kv.open();
      await con.set(["kind"], data);
      kv.close();
    });

    test("update", async () => {
        const repo = new MasterRepository(BASE);
        const service = new MasterService(repo);
        let res = await service.update({id: "kind", value: data2});
        expect(res.ok).toBe(true);
        res = await service.update({id: "kind", value: data3});
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new MasterRepository(BASE);
        const service = new MasterService(repo);
        const res = await service.get("kind");
        expect(data3).toEqual(res);
    });
});