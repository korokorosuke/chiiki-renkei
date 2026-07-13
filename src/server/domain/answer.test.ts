import { assert, assertFalse, fail } from "@std/assert"
import { AnswerRepository } from "../infra/answerRepository.ts"
import { AnswerPasswordRepository } from "../infra/answerPasswordRepository.ts"
import { AnswerService } from "./answerService.ts"
import type { Answer } from "./answer.ts"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import { answer, answer2, answer3, answer4 } from "../infra/testdata/answer.ts"
import { appointment, appointment6 } from "../infra/testdata/appointment.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(a1: Answer, a2: Answer): boolean {
    if(a1.questionnaire.id !== a2.questionnaire.id){
        return false;
    }
    if(a1.appointmentId !== a2.appointmentId){
        return false;
    }
    if(a1.inputDate !== a2.inputDate){
        return false;
    }
    if(a1.items.length !== a2.items.length){
        return false;
    }
    for(let i=0; i<a1.questionnaire.items.length; i++){
        const q1 = a1.questionnaire.items[i];
        const q2 = a2.questionnaire.items[i];
        const item1 = a1.items[i];
        const item2 = a2.items[i];
        if(q1.id !== q2.id){
            return false;
        }
        if(q1.question !== q2.question){
            return false;
        }
        if(q1.choices?.length !== q2.choices?.length){
            return false;
        }
        if(q1.choices){
            for(let j=0; j<q1.choices.length; j++){
                const choice1 = q1.choices[j];
                const choice2 = q2.choices?.[j];
                if(choice1.id !== choice2?.id){
                    return false;
                }
                if(choice1.text !== choice2?.text){
                    return false;
                }
            }
        }
        if(item1 !== item2){
            return false;
        }
    }
    return true;
}

Kv.test = true;

Deno.test("answer service", async (t) => {
    await t.step("prepare", async()=>{
        const repo = new AppointmentRepository(BASE);
        let res = await repo.insert(appointment);
        assert(res);
        res = await repo.insert(appointment6);
        assert(res);
    });

    await t.step("insert", async()=>{
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo, new AnswerPasswordRepository(BASE));
        answer.id = "";
        answer2.id = "";
        answer4.id = "";
        let res = await service.insert(answer);
        assert(res.ok);
        const list = await service.getList(answer.appointmentId);
        if(!list[0].id){
            fail("id is not set");
        }
        answer3.id = list[0].id;
        res = await service.insert(answer2);
        assert(res.ok);
        for(const a of list){
            if(a.id !== answer3.id){
                answer2.id = a.id;
            }
        }
        res = await service.insert(answer4);
        assert(res.ok);
        for(const a of list){
            if(a.id !== answer3.id && a.id !== answer2.id){
                answer4.id = a.id;
            }
        }
    });

    await t.step("update", async () => {
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo, new AnswerPasswordRepository(BASE));
        const res = await service.update(answer3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo, new AnswerPasswordRepository(BASE));
        let res = await service.get(answer.id);
        if(res){
            assert(compare(answer3, res));
        }else{
            fail();
        }
        res = await service.get(answer2.id);
        if(res){
            assert(compare(answer2, res));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo, new AnswerPasswordRepository(BASE));
        const res = await service.getList(answer.appointmentId);
        assert(res.length == 2);
    });

    await t.step("delete", async () => {
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo, new AnswerPasswordRepository(BASE));
        await service.delete(answer);
        let res = await service.get(answer.id);
        assertFalse(res);
        await service.delete(answer2);
        res = await service.get(answer2.id);
        assertFalse(res);
        await service.delete(answer4);
        res = await service.get(answer4.id);
        assertFalse(res);
        let list = await service.getListByPatient(appointment.patient.id);
        assert(list.length === 0);
        list = await service.getListByPatient(appointment6.patient.id);
        assert(list.length === 0);
        const apprepo = new AppointmentRepository(BASE);
        await apprepo.delete(appointment);
        await apprepo.delete(appointment6);
    });
});