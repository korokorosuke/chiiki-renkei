import { assert, assertFalse, fail } from "@std/assert"
import { DepartmentRepository } from "../infra/departmentRepository.ts"
import { DepartmentService } from "./departmentService.ts"
import type { Department } from "./department.ts"
import { department, department2, department3, department4 } from "../infra/testdata/dept.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: Department, u2: Department): boolean {
    if(u1.id !== u2.id){
        return false;
    }
    if(u1.name !== u2.name){
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("department service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        let res = await service.insert(department);
        assert(res.ok);
        res = await service.insert(department2);
        assert(res.ok);
        res = await service.insert(department4);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        const res = await service.update(department3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        let res = await service.get(department.id);
        if(res){
            assert(compare(department3, res));
        }else{
            fail();
        }
        res = await service.get(department2.id);
        if(res){
            assert(compare(department2, res));
        }else{
            fail();
        }
    });

    await t.step("exam", async () => {
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        const res = await service.getExam();
        if(res.length === 2){
            assert(compare(department3, res[0]));
            assert(compare(department2, res[1]));
        }else{
            console.log(`exam: ${res.length}`)
            fail();
        }
    })

    await t.step("all", async () => {
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        const res = await service.getAll();
        if(res.length === 3){
            assert(compare(department3, res[0]));
            assert(compare(department2, res[1]));
            assert(compare(department4, res[2]));
        }else{
            console.log(`all: ${res.length}`)
            fail();
        }
    })

    await t.step("delete", async () => {
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        await service.delete(department);
        let res = await service.get(department.id);
        assertFalse(res);
        await service.delete(department2);
        res = await service.get(department2.id);
        assertFalse(res);
        await service.delete(department4);
        res = await service.get(department4.id);
        assertFalse(res);
    });
});