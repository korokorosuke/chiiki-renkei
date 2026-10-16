import { describe, test, expect } from "vitest"
import { AppointmentService } from "./appointmentService.ts"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import { appointment, appointment2, appointment3, appointment4, appointment5 } from "../infra/testdata/appointment.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"
import { patient } from "../infra/testdata/patient.ts"

Kv.test = true;

describe("appointment service", () => {
    test("insert", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        appointment.id = "";
        let res = await service.insert(appointment);
        expect(res.ok).toBe(true);
        let list = await service.getListByDate("2024-06-01", "2999-12-31");
        if(!list[0].id){
            expect.fail("id is not set");
        }
        appointment3.id = list[0].id;
        res = await service.insert(appointment2);
        expect(res.ok).toBe(true);
        list = await service.getListByDate("2024-06-01", "2999-12-31");
        for(const a of list){
            if(appointment3.id !== a.id){
                appointment4.id = a.id;
                return;
            }
        }
        res = await service.insert(appointment5);
        expect(res.ok).toBe(false);
    });

    test("update", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        let res = await service.update(appointment3);
        expect(res.ok).toBe(true);
        res = await service.update(appointment4);
        expect(res.ok).toBe(true);
    });

    test("list", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        let res = await service.getListByDate("2024-06-07", "2024-06-07");
        if(res.length === 1){
            expect(appointment3).toEqual(res[0]);
        }else{
            console.log(res[0]);
            console.log(res[1]);
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getListByDate("2024-06-01", "2999-12-31");
        if(res.length === 2){
            expect(appointment3).toEqual(res[0]);
            expect(appointment4).toEqual(res[1]);
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    })

    test("read", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        let res = await service.get(appointment3.id);
        expect(appointment3).toEqual(res);
        res = await service.get(appointment4.id);
        expect(appointment4).toEqual(res);
    });

    test("patient", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        const res = await service.getListByPatient(patient.id);
        if(res.length === 1){
            expect(appointment3).toEqual(res[0]);
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
    })

    test("delete", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        await service.delete(appointment3);
        let res = await service.get(appointment3.id);
        expect(res).toBeUndefined();
        await service.delete(appointment4);
        res = await service.get(appointment4.id);
        expect(res).toBeUndefined();
    });
});