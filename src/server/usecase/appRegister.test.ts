import { assert, assertFalse, fail } from "@std/assert"
import { AppointmentService } from "../domain/appointmentService.ts"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import type { Appointment } from "../domain/appointment.ts"
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

function compare(app1: Appointment, app2: Appointment): boolean {
    if(app1.id !== app2.id){
        console.log(`id: ${app1.id} : ${app2.id}`)
        return false;
    }
    if(app1.date !== app2.date){
        console.log(`date: ${app1.date} : ${app2.date}`)
        return false;
    }
    if(app1.memo !== app2.memo){
        console.log(`memo: ${app1.memo} : ${app2.memo}`)
        return false;
    }
    if(app1.personInCharge && app2.personInCharge){
        const p1 = app1.personInCharge;
        const p2 = app2.personInCharge;
        if(p1.id !== p2.id){
            console.log(`personInCharge_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`personInCharge_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    if(app1.patient && app2.patient){
        const p1 = app1.patient;
        const p2 = app2.patient;
        if(p1.id !== p2.id){
            console.log(`patient_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.lastName !== p2.lastName){
            console.log(`patient_lastname: ${p1.lastName} : ${p2.lastName}`)
            return false;
        }
        if(p1.firstName !== p2.firstName){
            console.log(`patient_firstname: ${p1.firstName} : ${p2.firstName}`)
            return false;
        }
    }
    if(app1.facility && app2.facility){
        const p1 = app1.facility;
        const p2 = app2.facility;
        if(p1.id !== p2.id){
            console.log(`facility_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`facility_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    if(app1.facilityDr !== app2.facilityDr){
        console.log(`facilityDr: ${app1.facilityDr} : ${app2.facilityDr}`)
        return false;
    }
    if(app1.facilityDept && app2.facilityDept){
        if(app1.facilityDept !== app2.facilityDept){
            console.log(`facilityDept_id: ${app1.facilityDept} : ${app2.facilityDept}`)
            return false;
        }
    }
    if(app1.department && app2.department){
        const p1 = app1.department;
        const p2 = app2.department;
        if(p1.id !== p2.id){
            console.log(`department_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`department_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    if(app1.dr && app2.dr){
        const p1 = app1.dr;
        const p2 = app2.dr;
        if(p1.id !== p2.id){
            console.log(`dr_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`dr_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    if(app1.means && app2.means){
        if(app1.means !== app2.means){
            console.log(`means_id: ${app1.means} : ${app2.means}`)
            return false;
        }
    }
    if(app1.time !== app2.time){
        console.log(`time: ${app1.time} : ${app2.time}`)
        return false;
    }
    if(app1.appDisplay !== app2.appDisplay){
        console.log(`appDisplay: ${app1.appDisplay} : ${app2.appDisplay}`)
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("appointment registration", async (t) => {
    await t.step("insert", async () => {
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
        assert(res.ok);
        let list = await service.getListByDate("2024-06-01", "2999-12-31");
        appointment3.id = list[0].id;
        res = await usecase.insert(appointment2);
        assert(res.ok);
        list = await service.getListByDate("2024-06-01", "2999-12-31");
        for(const a of list){
            if(appointment3.id !== a.id){
                appointment4.id = a.id;
                return;
            }
        }
        res = await usecase.insert(appointment5);
        assertFalse(res.ok);
    });

    await t.step("update", async () => {
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
        assert(res.ok);
        res = await usecase.update(appointment4);
        assert(res.ok);
    });

    await t.step("list", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        let res = await service.getListByDate("2024-06-07", "2024-06-07");
        if(res.length === 1){
            assert(compare(appointment3, res[0]));
        }else{
            console.log(res[0]);
            console.log(res[1]);
            console.log(`list1: ${res.length}`)
            fail();
        }
        res = await service.getListByDate("2024-06-01", "2999-12-31");
        if(res.length === 2){
            assert(compare(appointment3, res[0]));
            assert(compare(appointment4, res[1]));
            appointment3.id = res[0].id;
            appointment4.id = res[1].id;
        }else{
            console.log(`list2: ${res.length}`)
            fail();
        }
        let res2 = await repo.list({fromDate:"2024-06-07", toDate:"2024-06-07"});
        if(res2.length === 1){
            assert(compare(appointment3, res2[0]));
        }else{
            console.log(res2[0]);
            console.log(res2[1]);
            console.log(`list3: ${res2.length}`)
            fail();
        }
        res2 = await repo.list({fromDate:"2024-06-01"});
        if(res2.length === 2){
            assert(compare(appointment3, res2[0]));
            assert(compare(appointment4, res2[1]));
        }else{
            console.log(`list4: ${res2.length}`)
            fail();
        }
    })

    await t.step("read", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        let res = await service.get(appointment3.id);
        if(res){
            assert(compare(appointment3, res));
        }else{
            console.log("1");
            console.log(res);
            fail();
        }
        res = await service.get(appointment4.id);
        if(res){
            assert(compare(appointment4, res));
        }else{
            console.log("2");
            console.log(res);
            fail();
        }
        let res2 = await repo.read(appointment3.id);
        if(res2){
            assert(compare(appointment3, res2));
        }else{
            console.log("3");
            console.log(res2);
            fail();
        }
        res2 = await repo.read(appointment4.id);
        if(res2){
            assert(compare(appointment4, res2));
        }else{
            console.log("4");
            console.log(res2);
            fail();
        }
    });

    await t.step("patient", async () => {
        const repo = new AppointmentRepository(BASE);
        const service = new AppointmentService(repo);
        const res = await service.getListByPatient(patient.id);
        if(res.length === 1){
            assert(compare(appointment3, res[0]));
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
        const res2 = await repo.list({patientId: patient.id});
        if(res2.length === 1){
            assert(compare(appointment3, res2[0]));
        }else{
            console.log(`list2: ${res2.length}`)
            fail();
        }
    })

    await t.step("delete", async () => {
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
        assertFalse(res);
        await usecase.delete(appointment4);
        res = await service.get(appointment4.id);
        assertFalse(res);
        let res2 = await repo.read(appointment3.id);
        assertFalse(res2);
        res2 = await repo.read(appointment4.id);
        assertFalse(res2);
        let list = await ansservice.getListByPatient(appointment3.patient.id);
        assert(list.length === 0);
        list = await ansservice.getListByPatient(appointment4.patient.id);
        assert(list.length === 0);
    });
});