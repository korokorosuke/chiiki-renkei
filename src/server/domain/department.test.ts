import { describe, test, expect } from "vitest"
import { DepartmentRepository } from "../infra/departmentRepository.ts"
import { DepartmentService } from "./departmentService.ts"
import { department, department2, department3, department4 } from "../infra/testdata/dept.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("department service", () => {
    test("insert", async()=>{
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        let res = await service.insert(department);
        expect(res.ok).toBe(true);
        res = await service.insert(department2);
        expect(res.ok).toBe(true);
        res = await service.insert(department4);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        const res = await service.update(department3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        let res = await service.get(department.id);
        expect(department3).toEqual(res);
        res = await service.get(department2.id);
        expect(department2).toEqual(res);
    });

    test("exam", async () => {
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        const res = await service.getExam();
        if(res.length === 2){
            expect(department3).toEqual(res[0]);
            expect(department2).toEqual(res[1]);
        }else{
            console.log(`exam: ${res.length}`)
            expect.fail();
        }
    })

    test("all", async () => {
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        const res = await service.getAll();
        if(res.length === 3){
            expect(department3).toEqual(res[0]);
            expect(department2).toEqual(res[1]);
            expect(department4).toEqual(res[2]);
        }else{
            console.log(`all: ${res.length}`)
            expect.fail();
        }
    })

    test("delete", async () => {
        const repo = new DepartmentRepository(BASE);
        const service = new DepartmentService(repo);
        await service.delete(department);
        let res = await service.get(department.id);
        expect(res).toBeUndefined();
        await service.delete(department2);
        res = await service.get(department2.id);
        expect(res).toBeUndefined();
        await service.delete(department4);
        res = await service.get(department4.id);
        expect(res).toBeUndefined();
    });
});