import { describe, test, expect } from "vitest"
import { AppointmentService } from "../domain/appointmentService.ts"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { appointment, appointment2, appointment3, appointment4, appointment5 } from "../infra/testdata/appointment.ts"
import { patient } from "../infra/testdata/patient.ts"
import { Kv } from "../infra/kv.ts"
import { AppointmentRegistration } from "./appointmentRegistration.ts"
import { AnswerRegistration } from "./answerRegistration.ts"
import { AnswerService } from "../domain/answerService.ts"
import { QuestionnaireService } from "../domain/questionnaireService.ts"
import { AnswerRepository } from "../infra/answerRepository.ts"
import { AnswerPasswordRepository } from "../infra/answerPasswordRepository.ts"
import { QuestionnaireRepository } from "../infra/questionnaireRepository.ts"

Kv.test = true;

describe("appointment registration", () => {
    test("insert", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        const usecase = new AppointmentRegistration(
            service,
            new AnswerRegistration(
                new AnswerService(new AnswerRepository(BASE),
                    new AnswerPasswordRepository(BASE)),
                new QuestionnaireService(new QuestionnaireRepository(BASE))
            ));
        appointment.id = "";
        appointment2.id = "";
        appointment5.id = "";
        let res = await usecase.insert(appointment);
        expect(res.ok).toBe(true);
        let list = await service.getListByDate("2024-06-01", "2999-12-31");
        appointment3.id = list[0].id;
        res = await usecase.insert(appointment2);
        expect(res.ok).toBe(true);
        list = await service.getListByDate("2024-06-01", "2999-12-31");
        for(const a of list){
            if(appointment3.id !== a.id){
                appointment4.id = a.id;
                return;
            }
        }
        res = await usecase.insert(appointment5);
        expect(res.ok).toBe(false);
    });

    test("update", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        const usecase = new AppointmentRegistration(
            service,
            new AnswerRegistration(
                new AnswerService(new AnswerRepository(BASE),
                    new AnswerPasswordRepository(BASE)),
                new QuestionnaireService(new QuestionnaireRepository(BASE))
            ));
        let res = await usecase.update(appointment3);
        expect(res.ok).toBe(true);
        res = await usecase.update(appointment4);
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
            appointment3.id = res[0].id;
            appointment4.id = res[1].id;
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
        let res2 = await repo.list({fromDate:"2024-06-07", toDate:"2024-06-07"});
        if(res2.length === 1){
            expect(appointment3).toEqual(res2[0]);
        }else{
            console.log(res2[0]);
            console.log(res2[1]);
            console.log(`list3: ${res2.length}`)
            expect.fail();
        }
        res2 = await repo.list({fromDate:"2024-06-01"});
        if(res2.length === 2){
            expect(appointment3).toEqual(res2[0]);
            expect(appointment4).toEqual(res2[1]);
        }else{
            console.log(`list4: ${res2.length}`)
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
        let res2 = await repo.read(appointment3.id);
        expect(appointment3).toEqual(res2);
        res2 = await repo.read(appointment4.id);
        expect(appointment4).toEqual(res2);
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
        const res2 = await repo.list({patientId: patient.id});
        if(res2.length === 1){
            expect(appointment3).toEqual(res2[0]);
        }else{
            console.log(`list2: ${res2.length}`)
            expect.fail();
        }
    })

    test("delete", async () => {
        const repo = new AppointmentRepository(BASE);
        const ansservice = new AnswerService(new AnswerRepository(BASE),
                    new AnswerPasswordRepository(BASE));
        const service = new AppointmentService(repo);
        const usecase = new AppointmentRegistration(
            service,
            new AnswerRegistration(
                ansservice,
                new QuestionnaireService(new QuestionnaireRepository(BASE))
            ));
        await usecase.delete(appointment3);
        let res = await service.get(appointment3.id);
        expect(res).toBeUndefined();
        await usecase.delete(appointment4);
        res = await service.get(appointment4.id);
        expect(res).toBeUndefined();
        let res2 = await repo.read(appointment3.id);
        expect(res2).toBeUndefined();
        res2 = await repo.read(appointment4.id);
        expect(res2).toBeUndefined();
        let list = await ansservice.getListByPatient(appointment3.patient.id);
        expect(list.length).toBe(0);
        list = await ansservice.getListByPatient(appointment4.patient.id);
        expect(list.length).toBe(0);
    });
});