import { describe, test, expect } from "vitest"
import { AnswerRepository } from "../infra/answerRepository.ts"
import { AnswerPasswordRepository } from "../infra/answerPasswordRepository.ts"
import { AnswerService } from "./answerService.ts"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import { answer, answer2, answer3, answer4 } from "../infra/testdata/answer.ts"
import { appointment, appointment6 } from "../infra/testdata/appointment.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("answer service", () => {
    test("prepare", async()=>{
        const repo = new AppointmentRepository(BASE);
        let res = await repo.insert(appointment);
        expect(res).toBe(true);
        res = await repo.insert(appointment6);
        expect(res).toBe(true);
    });

    test("insert", async()=>{
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo, new AnswerPasswordRepository(BASE));
        answer.id = "";
        answer2.id = "";
        answer4.id = "";
        let res = await service.insert(answer);
        expect(res.ok).toBe(true);
        const list = await service.getList(answer.appointmentId);
        if(!list[0].id){
            expect.fail("id is not set");
        }
        answer3.id = list[0].id;
        res = await service.insert(answer2);
        expect(res.ok).toBe(true);
        for(const a of list){
            if(a.id !== answer3.id){
                answer2.id = a.id;
            }
        }
        res = await service.insert(answer4);
        expect(res.ok).toBe(true);
        for(const a of list){
            if(a.id !== answer3.id && a.id !== answer2.id){
                answer4.id = a.id;
            }
        }
    });

    test("update", async () => {
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo, new AnswerPasswordRepository(BASE));
        const res = await service.update(answer3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo, new AnswerPasswordRepository(BASE));
        let res = await service.get(answer.id);
        expect(answer3).toEqual(res);
        res = await service.get(answer2.id);
        expect(answer2).toEqual(res);
    });

    test("list", async () => {
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo, new AnswerPasswordRepository(BASE));
        const res = await service.getList(answer.appointmentId);
        expect(res.length).toBe(2);
    });

    test("delete", async () => {
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo, new AnswerPasswordRepository(BASE));
        await service.delete(answer);
        let res = await service.get(answer.id);
        expect(res).toBeUndefined();
        await service.delete(answer2);
        res = await service.get(answer2.id);
        expect(res).toBeUndefined();
        await service.delete(answer4);
        res = await service.get(answer4.id);
        expect(res).toBeUndefined();
        let list = await service.getListByPatient(appointment.patient.id);
        expect(list.length).toBe(0);
        list = await service.getListByPatient(appointment6.patient.id);
        expect(list.length).toBe(0);
    });

    test("cleanUp", async()=>{
        const apprepo = new AppointmentRepository(BASE);
        await apprepo.delete(appointment);
        await apprepo.delete(appointment6);
    });
});