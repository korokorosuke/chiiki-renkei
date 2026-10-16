import { describe, test, expect } from "vitest"
import { WebAppRepository } from "../infra/webAppointmentRepository.ts"
import type { WebAppointment } from "../domain/webAppointment.ts"
import { AppointmentService } from "../domain/appointmentService.ts"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import type { WebReservation } from "../domain/webReservation.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { facility, facility2, toFac } from "../infra/testdata/facility.ts"
import { patient, patient2, patient6, patient4, patientNoId } from "../infra/testdata/patient.ts"
import { dr, dr2 } from "../infra/testdata/webDr.ts"
import { department, department2 } from "../infra/testdata/webDept.ts"
import { user } from "../infra/testdata/user.ts"
import { initWebDr } from "../lib/types.ts"
import { Kv } from "../infra/kv.ts"
import { WebAppService, ID_EMPTY, DATE_EMPTY } from "../domain/webAppointmentService.ts"
import { WebReservationService } from "../domain/webReservationService.ts"
import { WebReservationRepository } from "../infra/webReservationRepository.ts"
import { WebAppointmentRegistration } from "./webAppointmentRegistration.ts"
import { AppointmentRegistration } from "./appointmentRegistration.ts"
import { toAppointment } from "../lib/types.ts"
import { AnswerRegistration } from "./answerRegistration.ts"
import { AnswerService } from "../domain/answerService.ts"
import { AnswerRepository } from "../infra/answerRepository.ts"
import { AnswerPasswordRepository } from "../infra/answerPasswordRepository.ts"
import { QuestionnaireService } from "../domain/questionnaireService.ts"
import { QuestionnaireRepository } from "../infra/questionnaireRepository.ts"

const reservation: WebReservation = {
    dept: "01",
    dr: "00001",
    date: "2024-06-07",
    time: "09:00",
    max: 3,
    cnt: 0
}
const reservation2: WebReservation = {
    dept: "02",
    dr: "00001",
    date: "2024-06-08",
    time: "14:30",
    max: 3,
    cnt: 0
}
const reservation3: WebReservation = {
    dept: "01",
    dr: "00002",
    date: "2024-06-07",
    time: "09:30",
    max: 3,
    cnt: 0
}
const reservation4: WebReservation = {
    dept: "02",
    dr: "00001",
    date: "2024-06-09",
    time: "14:30",
    max: 3,
    cnt: 0
}
const reservation5: WebReservation = {
    dept: "02",
    dr: "00001",
    date: "2024-06-10",
    time: "14:30",
    max: 3,
    cnt: 2
}
const reservation6: WebReservation = {
    dept: "02",
    dr: "00001",
    date: "2024-06-15",
    time: "14:30",
    max: 3,
    cnt: 3
}


const appointment: WebAppointment = {
    id: "0001-00001",
    patient: patient,
    date: "2024-06-07",
    time: "09:00",
    facility: toFac(facility),
    department: department,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment2: WebAppointment = {
    id: "0002-11111",
    patient: patient2,
    date: "2024-06-08",
    time: "14:30",
    facility: toFac(facility),
    department: department2,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-06 12:34:56",
}
const appointment3: WebAppointment = {
    id: "0001-00001",
    patient: patient,
    date: "2024-06-07",
    time: "09:30",
    facility: toFac(facility),
    department: department,
    dr: dr2,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:38:56",
}
const appointment4: WebAppointment = {
    id: "0002-11111",
    patient: patient2,
    date: "2024-06-09",
    time: "14:30",
    facility: toFac(facility),
    department: department2,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment5: WebAppointment = {
    id: "0003-11111",
    patient: patient2,
    date: "2024-06-10",
    time: "14:30",
    facility: toFac(facility2),
    department: department2,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment6: WebAppointment = {
    id: "0006-11111",
    patient: patient2,
    date: "2024-06-15",
    time: "14:30",
    facility: toFac(facility2),
    department: department2,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment_noid: WebAppointment = {
    id: "0001-00001",
    patient: patientNoId,
    date: "2024-06-07",
    time: "09:00",
    facility: toFac(facility),
    department: department,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment_noid2: WebAppointment = {
    id: "0001-00001",
    patient: patient4,
    date: "2024-06-07",
    time: "09:00",
    facility: toFac(facility),
    department: department,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment_noid1: WebAppointment = {
    id: "0001-00001",
    patient: patientNoId,
    date: "2024-06-08",
    time: "14:30",
    facility: toFac(facility),
    department: department2,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment_noid3: WebAppointment = {
    id: "0001-00001",
    patient: patientNoId,
    date: "2024-06-09",
    time: "14:30",
    facility: toFac(facility),
    department: department2,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment_nodate: WebAppointment = {
    id: "0001-00001",
    patient: patient,
    date: "",
    time: "",
    facility: toFac(facility),
    department: department,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    consultation: {
        first: "2024-06-10", second: "", etc: "hoge"
    },
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment_nodate2: WebAppointment = {
    id: "0001-00001",
    patient: patient,
    date: "",
    time: "",
    facility: toFac(facility),
    department: department,
    dr: initWebDr(),
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    consultation: {
        first: "2024-06-10", second: "", etc: "hoge"
    },
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment_nodate1: WebAppointment = {
    id: "0001-00001",
    patient: patient6,
    date: "",
    time: "",
    facility: toFac(facility),
    department: department,
    dr: initWebDr(),
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    consultation: {
        first: "2024-06-10", second: "", etc: "hoge"
    },
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment_nodate3: WebAppointment = {
    id: "0001-00001",
    patient: patient6,
    date: "2024-06-09",
    time: "14:30",
    facility: toFac(facility),
    department: department2,
    dr: dr,
    facPatientId: "",
    mainComplaint: "風邪",
    cancel: false,
    consultation: {
        first: "2024-06-10", second: "", etc: "hoge"
    },
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}
const appointment_required: WebAppointment = {
    id: "0001-00001",
    patient: patient6,
    date: "2024-06-09",
    time: "14:30",
    facility: toFac(facility),
    department: department2,
    dr: dr,
    facPatientId: "",
    mainComplaint: "",
    cancel: false,
    consultation: {
        first: "2024-06-10", second: "", etc: "hoge"
    },
    createdBy: user,
    createdAt: "2024-06-07 12:34:56",
    updatedBy: user,
    updatedAt: "2024-06-07 12:34:56",
}

function convertEmpty(a: WebAppointment): WebAppointment{
    if(a.patient.id === ""){
        a.patient.id = ID_EMPTY;
    }
    if(a.date === ""){
        a.date = DATE_EMPTY;
    }
    return a;
}


Kv.test = true;

describe("webappointment registration", () => {
    test("prepare", async () => {
        const repo = new WebReservationRepository(BASE);
        await repo.insert(reservation);
        await repo.insert(reservation2);
        await repo.insert(reservation3);
        await repo.insert(reservation4);
        await repo.insert(reservation5);
        await repo.insert(reservation6);
    });
    test("insert", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const appservice = new AppointmentService(new AppointmentRepository(BASE));
        const usecase =
            new WebAppointmentRegistration(
                service,
                new AppointmentRegistration(
                    appservice,
                    new AnswerRegistration(
                        new AnswerService(new AnswerRepository(BASE),
                        new AnswerPasswordRepository(BASE)),
                        new QuestionnaireService(new QuestionnaireRepository(BASE)))),
                new WebReservationService(new WebReservationRepository(BASE)),
            );
        let res = await usecase.insert(appointment);
        if(res.ok){
            appointment3.id = res.data.id;
        }else{
            expect.fail();
        }
        res = await usecase.insert(appointment2);
        if(res.ok){
            appointment4.id = res.data.id;
        }else{
            expect.fail();
        }
        res = await usecase.insert(appointment5);
        if(res.ok){
            appointment5.id = res.data.id;
        }else{
            expect.fail();
        }
        res = await usecase.insert(appointment6);
        if(!res.ok){
          console.log(res.errors);
        }
        expect(res.ok).toBe(false);
        res = await usecase.insert(appointment_required);
        if(!res.ok){
          console.log(res.errors);
        }
        expect(res.ok).toBe(false);
        res = await usecase.insert(appointment_nodate);
        if(res.ok){
            appointment_nodate2.id = res.data.id;
        }else{
            expect.fail();
        }
        res = await usecase.insert(appointment_nodate1);
        if(res.ok){
            appointment_nodate3.id = res.data.id;
        }else{
            expect.fail();
        }
        res = await usecase.insert(appointment_noid);
        if(res.ok){
            appointment_noid.id = res.data.id;
            appointment_noid2.id = res.data.id;
        }else{
            expect.fail();
        }
        res = await usecase.insert(appointment_noid1);
        if(res.ok){
            appointment_noid3.id = res.data.id;
        }else{
            expect.fail();
        }
    });

    test("update", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const usecase =
            new WebAppointmentRegistration(
                service,
                new AppointmentRegistration(
                    new AppointmentService(new AppointmentRepository(BASE)),
                    new AnswerRegistration(
                        new AnswerService(new AnswerRepository(BASE),
                        new AnswerPasswordRepository(BASE)),
                        new QuestionnaireService(new QuestionnaireRepository(BASE)))),
                new WebReservationService(new WebReservationRepository(BASE)),
            );
        let res = await usecase.update(appointment3);
        if(!res.ok){
            console.log(res.errors!);
        }
        expect(res.ok).toBe(true);
        res = await usecase.update(appointment4);
        if(!res.ok){
            console.log(res.errors!);
        }
        expect(res.ok).toBe(true);
        res = await usecase.update(appointment_nodate2);
        if(!res.ok){
            console.log(res.errors!);
        }
        expect(res.ok).toBe(true);
        res = await usecase.update(appointment_nodate3);
        if(!res.ok){
            console.log(res.errors!);
        }
        expect(res.ok).toBe(true);
        res = await usecase.update(appointment_noid2);
        if(!res.ok){
            console.log(res.errors!);
        }
        expect(res.ok).toBe(true);
        //枠無しのため失敗する
        res = await usecase.update(appointment_noid3);
        if(!res.ok){
            console.log(res.errors!);
        }
        expect(res.ok).toBe(false);
    });

    test("count check", async () => {
        const repo = new WebReservationRepository(BASE);
        let res = await repo.read(reservation.dept, reservation.dr, reservation.date, reservation.time);
        if(res){
            expect(res.cnt).toBe(1);
        }else{
            console.log("res1");
            expect.fail();
        }
        res = await repo.read(reservation2.dept, reservation2.dr, reservation2.date, reservation2.time);
        if(res){
            expect(res.cnt).toBe(1);
        }else{
            console.log("res2");
            expect.fail();
        }
        res = await repo.read(reservation3.dept, reservation3.dr, reservation3.date, reservation3.time);
        if(res){
            expect(res.cnt).toBe(1);
        }else{
            console.log("res3");
            expect.fail();
        }
        res = await repo.read(reservation4.dept, reservation4.dr, reservation4.date, reservation4.time);
        if(res){
            expect(res.cnt).toBe(3);
        }else{
            console.log("res4");
            expect.fail();
        }
        res = await repo.read(reservation5.dept, reservation5.dr, reservation5.date, reservation5.time);
        if(res){
            expect(res.cnt).toBe(3);
        }else{
            console.log("res5");
            expect.fail();
        }
        res = await repo.read(reservation6.dept, reservation6.dr, reservation6.date, reservation6.time);
        if(res){
            expect(res.cnt).toBe(3);
        }else{
            console.log("res6");
            expect.fail();
        }
    });

    test("list", async () => {
        const apprepo = new AppointmentRepository(BASE);
        const appservice = new AppointmentService(apprepo);
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        let res = await service.getList({fromDate:"2024-06-07", toDate: "2024-06-07"});
        if(res.length === 2){
            for(const a of res){
                if(a.id === appointment3.id){
                    expect(appointment3).toEqual(a);
                }else{
                    expect(appointment_noid2).toEqual(a);
                }
            }
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getList({fromDate:"2024-06-01"});
        if(res.length === 6){
            for(let a of res){
                a = convertEmpty(a);
                if(a.id === appointment3.id){
                    expect(appointment3).toEqual(a);
                }else if(a.id === appointment4.id){
                    expect(appointment4).toEqual(a);
                }else if(a.id === appointment5.id){
                    expect(appointment5).toEqual(a);
                }else if(a.id === appointment_noid1.id){
                    expect(appointment_noid1).toEqual(a);
                }else if(a.id === appointment_noid2.id){
                    expect(appointment_noid2).toEqual(a);
                }else if(a.id === appointment_nodate3.id){
                    expect(appointment_nodate3).toEqual(a);
                }else{
                    expect.fail();
                }
            }
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
        let res2 = await appservice.getListByDate("2024-06-07", "2024-06-07");
        if(res2.length === 2){
            for(const a of res2){
                if(a.id === appointment3.id){
                    expect(toAppointment(appointment3)).toEqual(a);
                }else if(a.id === appointment_noid2.id){
                    expect(toAppointment(appointment_noid2)).toEqual(a);
                }else{
                    expect.fail();
                }
            }
        }else{
            console.log(`list3: ${res.length}`)
            expect.fail();
        }
        res2 = await appservice.getListByDate("2024-06-01", "2024-07-07");
        if(res2.length === 5){
            for(const a of res2){
                if(a.id === appointment3.id){
                    expect(toAppointment(appointment3)).toEqual(a);
                }else if(a.id === appointment4.id){
                    expect(toAppointment(appointment4)).toEqual(a);
                }else if(a.id === appointment5.id){
                    expect(toAppointment(appointment5)).toEqual(a);
                }else if(a.id === appointment_noid2.id){
                    expect(toAppointment(appointment_noid2)).toEqual(a);
                }else if(a.id === appointment_nodate3.id){
                    expect(toAppointment(appointment_nodate3)).toEqual(a);
                }else{
                    expect.fail();
                }
            }
        }else{
            console.log(`list4: ${res2.length}`)
            expect.fail();
        }
        let res3 = await apprepo.list({fromDate:"2024-06-07", toDate:"2024-06-07"});
        if(res3.length === 2){
            for(const a of res3){
                if(a.id === appointment3.id){
                    expect(toAppointment(appointment3)).toEqual(a);
                }else if(a.id === appointment_noid2.id){
                    expect(toAppointment(appointment_noid2)).toEqual(a);
                }else{
                    expect.fail();
                }
            }
        }else{
            console.log(`list5: ${res3.length}`)
            expect.fail();
        }
        res3 = await apprepo.list({fromDate:"2024-06-01"});
        if(res3.length === 5){
            for(const a of res3){
                if(a.id === appointment3.id){
                    expect(toAppointment(appointment3)).toEqual(a);
                }else if(a.id === appointment4.id){
                    expect(toAppointment(appointment4)).toEqual(a);
                }else if(a.id === appointment5.id){
                    expect(toAppointment(appointment5)).toEqual(a);
                }else if(a.id === appointment_noid2.id){
                    expect(toAppointment(appointment_noid2)).toEqual(a);
                }else if(a.id === appointment_nodate3.id){
                    expect(toAppointment(appointment_nodate3)).toEqual(a);
                }else{
                    expect.fail();
                }
            }
        }else{
            console.log(`list6: ${res3.length}`)
            expect.fail();
        }
    })

    test("patient", async () => {
        const apprepo = new AppointmentRepository(BASE);
        const appservice = new AppointmentService(apprepo);
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getList({patientId: patient.id});
        if(res.length === 2){
            for(let a of res){
                a = convertEmpty(a);
                if(a.id === appointment3.id){
                    expect(appointment3).toEqual(a);
                }else{
                    expect(appointment_nodate2).toEqual(a);
                }
            }
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        const res2 = await appservice.getListByPatient(patient4.id);
        if(res2.length === 1){
            expect(toAppointment(appointment_noid2)).toEqual(res2[0]);
        }
        const res3 = await service.getList({patientId: patient6.id});
        if(res3.length === 1){
            for(const a of res3){
                expect(appointment_nodate3).toEqual(a);
            }
        }else{
            console.log(`list2: ${res3.length}`)
            expect.fail();
        }
    })

    test("facility", async () => {
        const apprepo = new AppointmentRepository(BASE);
        const appservice = new AppointmentService(apprepo);
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getList({facilityId: facility2.id});
        if(res.length === 1){
            expect(appointment5).toEqual(res[0]);
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        const res2 = await appservice.get(res[0].id);
        expect(toAppointment(appointment5)).toEqual(res2);
    })

    test("consult", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getConsultation(facility.id);
        if(res.length === 1){
            res[0] = convertEmpty(res[0]);
            expect(appointment_nodate2).toEqual(res[0]);
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
    })

    test("noid", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getNoID();
        if(res.length === 1){
            res[0] = convertEmpty(res[0]);
            expect(appointment_noid1).toEqual(res[0]);
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
    })

    test("delete", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const usecase =
            new WebAppointmentRegistration(
                service,
                new AppointmentRegistration(
                    new AppointmentService(new AppointmentRepository(BASE)),
                    new AnswerRegistration(
                        new AnswerService(new AnswerRepository(BASE),
                            new AnswerPasswordRepository(BASE)),
                        new QuestionnaireService(new QuestionnaireRepository(BASE)))),
                new WebReservationService(new WebReservationRepository(BASE)),
            );
        await usecase.delete(appointment3);
        let res = await repo.read(appointment3.id);
        expect(res).toBeUndefined();
        let res2 = await service.get(appointment3.id);
        expect(res2).toBeUndefined();
        await usecase.delete(appointment4);
        res = await repo.read(appointment4.id);
        expect(res).toBeUndefined();
        res2 = await service.get(appointment4.id);
        expect(res2).toBeUndefined();
        await usecase.delete(appointment5);
        res = await repo.read(appointment5.id);
        expect(res).toBeUndefined();
        res2 = await service.get(appointment5.id);
        expect(res2).toBeUndefined();
        await usecase.delete(appointment_nodate2);
        res = await repo.read(appointment_nodate2.id);
        expect(res).toBeUndefined();
        await usecase.delete(appointment_nodate3);
        res = await repo.read(appointment_nodate3.id);
        expect(res).toBeUndefined();
        res2 = await service.get(appointment_nodate3.id);
        expect(res2).toBeUndefined();
        expect(res).toBeUndefined();
        await usecase.delete(appointment_noid2);
        res = await repo.read(appointment_noid2.id);
        expect(res).toBeUndefined();
        res2 = await service.get(appointment_noid2.id);
        expect(res2).toBeUndefined();
        await usecase.delete(appointment_noid3);
        res = await repo.read(appointment_noid3.id);
    });

    test("cleanup", async () => {
        const repo = new WebReservationRepository(BASE);
        await repo.delete(reservation);
        await repo.delete(reservation2);
        await repo.delete(reservation3);
        await repo.delete(reservation4);
        await repo.delete(reservation5);
        await repo.delete(reservation6);
    });
});