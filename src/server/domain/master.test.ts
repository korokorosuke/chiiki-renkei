import { assert, fail } from "@std/assert"
import { MasterRepository } from "../infra/masterRepository.ts"
import { MasterService } from "./masterService.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

const data = ["あああ","いいい","ううう"];
const data2 = ["あああ","いいい","うううう"];
const data3 = ["あああ","いいい","うううう","えええ"];

function compare(d1: string[], d2: string[]): boolean {
    if(d1.length !== d2.length){
        return false;
    }
    for(let i = 0; i < d1.length; i++){
        if(d1[i] !== d2[i]){
            return false;
        }
    }
    return true;
}

Kv.test = true;

Deno.test("master service", async (t) => {
    const kv = new Kv();
    const con = await kv.open();
    await con.set(["kind"], data);
    kv.close();

    await t.step("update", async () => {
        const repo = new MasterRepository(BASE);
        const service = new MasterService(repo);
        let res = await service.update({id: "kind", value: data2});
        assert(res.ok);
        res = await service.update({id: "kind", value: data3});
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new MasterRepository(BASE);
        const service = new MasterService(repo);
        const res = await service.get("kind");
        if(res){
            assert(compare(data3, res));
        }else{
            fail();
        }
    });
});