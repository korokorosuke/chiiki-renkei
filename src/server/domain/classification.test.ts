import { assert, assertFalse, fail } from "@std/assert"
import { ClassificationRepository } from "../infra/classificationRepository.ts"
import { ClassificationService } from "./classificationService.ts"
import type { Classification } from "./classification.ts"
import { classification1, classification2, classification3, classification4 } from "../infra/testdata/classification.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: Classification, u2: Classification): boolean {
    if(u1.id !== u2.id){
        return false;
    }
    if(u1.name !== u2.name){
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("Classification service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new ClassificationRepository(BASE);
        const service = new ClassificationService(repo);
        let res = await service.insert(classification1);
        assert(res.ok);
        res = await service.insert(classification2);
        assert(res.ok);
        res = await service.insert(classification4);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new ClassificationRepository(BASE);
        const service = new ClassificationService(repo);
        const res = await service.update(classification3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new ClassificationRepository(BASE);
        const service = new ClassificationService(repo);
        let res = await service.get(classification1.id);
        if(res){
            assert(compare(classification3, res));
        }else{
            fail();
        }
        res = await service.get(classification2.id);
        if(res){
            assert(compare(classification2, res));
        }else{
            fail();
        }
    });

    await t.step("all", async () => {
        const repo = new ClassificationRepository(BASE);
        const service = new ClassificationService(repo);
        const res = await service.getAll();
        if(res.length === 3){
            assert(compare(classification3, res[0]));
            assert(compare(classification2, res[1]));
            assert(compare(classification4, res[2]));
        }else{
            console.log(`all: ${res.length}`)
            fail();
        }
    })

    await t.step("delete", async () => {
        const repo = new ClassificationRepository(BASE);
        const service = new ClassificationService(repo);
        await service.delete(classification1);
        let res = await service.get(classification1.id);
        assertFalse(res);
        await service.delete(classification2);
        res = await service.get(classification2.id);
        assertFalse(res);
        await service.delete(classification4);
        res = await service.get(classification4.id);
        assertFalse(res);
    });
});