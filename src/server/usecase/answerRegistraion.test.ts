import { assert, fail } from "@std/assert"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import { AnswerRepository } from "../infra/answerRepository.ts"
import { AnswerPasswordRepository } from "../infra/answerPasswordRepository.ts"
import { AnswerService } from "../domain/answerService.ts"
import { AnswerRegistration } from "./answerRegistration.ts"
import { QuestionnaireService } from "../domain/questionnaireService.ts"
import { QuestionnaireRepository } from "../infra/questionnaireRepository.ts"
import { questionnaire3, questionnaire4, questionnaire5 } from "../infra/testdata/questionnaire.ts"
import { appointment, appointment6 } from "../infra/testdata/appointment.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

Deno.test("answer registration", async (t) => {
    await t.step("prepare", async () => {
        const apprepo = new AppointmentRepository(BASE);
        let res = await apprepo.insert(appointment);
        assert(res);
        res = await apprepo.insert(appointment6);
        assert(res);
        const qrepo = new QuestionnaireRepository(BASE);
        res = await qrepo.insert(questionnaire3);
        assert(res);
        res = await qrepo.insert(questionnaire4);
        assert(res);
        res = await qrepo.insert(questionnaire5);
        assert(res);
    });
    await t.step("insert", async()=>{
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo,
            new AnswerPasswordRepository(BASE));
        const reg = new AnswerRegistration(service,
                new QuestionnaireService(new QuestionnaireRepository(BASE)));
        const res = await reg.insert(appointment);
        assert(res.ok);

        const list = await service.getList(appointment.id);
        if(list.length !== 2){
            fail("no data");
        }
        for(const ans of list){
            if(ans.questionnaire.id !== questionnaire3.id &&
                    ans.questionnaire.id !== questionnaire4.id){
                fail();
            }else{
                assert(appointment.date === ans.appointmentDate);
            }
        }
        list[0].inputDate = "2024-06-07T12:00:00Z";
        await repo.update(list[0]);
    });

    await t.step("update", async () => {
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo,
            new AnswerPasswordRepository(BASE));
        const reg = new AnswerRegistration(service,
                new QuestionnaireService(new QuestionnaireRepository(BASE)));
        appointment.department = {id: "02", name: "内科"};
        const apprepo = new AppointmentRepository(BASE);
        await apprepo.update(appointment);
        const res = await reg.update(appointment);
        assert(res.ok);

        const list = await service.getList(appointment.id);
        if(list.length !== 2){
            fail("wrong data length");
        }
        for(const ans of list){
            if(!ans.inputDate){
                if(ans.questionnaire.id !== questionnaire5.id){
                    fail("wrong questionnaire");
                }
            }
        }
    });

    await t.step("delete", async () => {
        const qrepo = new QuestionnaireRepository(BASE);
        const qservice = new QuestionnaireService(qrepo);
        const repo = new AnswerRepository(BASE);
        const service = new AnswerService(repo,
            new AnswerPasswordRepository(BASE));
        const reg = new AnswerRegistration(service, qservice);
        await reg.delete(appointment);
        const list = await service.getList(appointment.id);
        for(const ans of list){
            await repo.delete(ans);
        }
        const qlist = await qservice.getList();
        for(const q of qlist){
            await qrepo.delete(q);
        }
        const apprepo = new AppointmentRepository(BASE);
        await apprepo.delete(appointment);
        await apprepo.delete(appointment6);
    });
});