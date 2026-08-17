import { assert, assertFalse, fail } from "@std/assert"
import { WebAppRepository } from "../infra/webAppointmentRepository.ts"
import type { WebAppointment } from "../domain/webAppointment.ts"
import { AppointmentService } from "../domain/appointmentService.ts"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import type { WebReservation } from "../domain/webReservation.ts"
import type { Appointment } from "../domain/appointment.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { facility, facility2, toFac } from "../infra/testdata/facility.ts"
import { patient, patient2, patient6, patient4, patientNoId } from "../infra/testdata/patient.ts"
import { dr, dr2 } from "../infra/testdata/webDr.ts"
import { department, department2 } from "../infra/testdata/webDept.ts"
import { user } from "../infra/testdata/user.ts"
import { initWebDr } from "../lib/types.ts"
import { Kv } from "../infra/kv.ts"
import { WebAppService } from "../domain/webAppointmentService.ts"
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

function compare(app1: WebAppointment, app2: WebAppointment): boolean {
    //if(app1.id !== app2.id){
    //    console.log(`id: ${app1.id} : ${app2.id}`)
    //    return false;
    //}
    if(app1.date !== app2.date){
        console.log(`date: ${app1.date} : ${app2.date}`)
        return false;
    }
    if(app1.time !== app2.time){
        console.log(`time: ${app1.time} : ${app2.time}`)
        return false;
    }
    if(app1.mainComplaint !== app2.mainComplaint){
        console.log(`mainComplaint: ${app1.mainComplaint} : ${app2.mainComplaint}`)
        return false;
    }
    if(app1.patient && app2.patient){
        const p1 = app1.patient;
        const p2 = app2.patient;
        if(p1.id !== p2.id){
            console.log(`patient_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.lastName !== p2.lastName){
            console.log(`patient_name: ${p1.lastName} : ${p2.lastName}`)
            return false;
        }
        if(p1.firstName !== p2.firstName){
            console.log(`patient_name: ${p1.firstName} : ${p2.firstName}`)
            return false;
        }
    }
    if(app1.facility.id !== app2.facility.id){
        console.log(`facilityId: ${app1.facility.id} : ${app2.facility.id}`)
        return false;
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
    if(app1.facPatientId !== app2.facPatientId){
        console.log(`facPatientId: ${app1.facPatientId} : ${app2.facPatientId}`)
        return false;
    }
    return true;
}
function compare2(app1: Appointment, app2: Appointment): boolean {
    //if(app1.id !== app2.id){
    //    console.log(`id: ${app1.id} : ${app2.id}`)
    //    return false;
    //}
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

Deno.test("webappointment registration", async (t) => {
    await t.step("prepare", async () => {
        const repo = new WebReservationRepository(BASE);
        await repo.insert(reservation);
        await repo.insert(reservation2);
        await repo.insert(reservation3);
        await repo.insert(reservation4);
        await repo.insert(reservation5);
        await repo.insert(reservation6);
    });
    await t.step("insert", async () => {
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
                    new QuestionnaireService(new QuestionnaireRepository(BASE))
            )));
        let res = await usecase.insert(appointment);
        if(res.ok){
            appointment3.id = res.data!.id;
        }else{
            fail();
        }
        res = await usecase.insert(appointment2);
        if(res.ok){
            appointment4.id = res.data!.id;
        }else{
            fail();
        }
        res = await usecase.insert(appointment5);
        if(res.ok){
            appointment5.id = res.data!.id;
        }else{
            fail();
        }
        res = await usecase.insert(appointment6);
        assertFalse(res.ok);
        res = await usecase.insert(appointment_required);
        assertFalse(res.ok);
        res = await usecase.insert(structuredClone(appointment_nodate));
        if(res.ok){
            appointment_nodate.id = res.data!.id;
            appointment_nodate2.id = res.data!.id;
        }else{
            fail();
        }
        res = await usecase.insert(structuredClone(appointment_nodate1));
        if(res.ok){
            appointment_nodate3.id = res.data!.id;
        }else{
            fail();
        }
        res = await usecase.insert(structuredClone(appointment_noid));
        if(res.ok){
            appointment_noid.id = res.data!.id;
            appointment_noid2.id = res.data!.id;
        }else{
            fail();
        }
        let resapp = await appservice.get(appointment_noid.id);
        if(resapp){
            console.log("should not be here, but data found");
            fail();
        }
        res = await usecase.insert(structuredClone(appointment_noid1));
        if(res.ok){
            appointment_noid3.id = res.data!.id;
        }else{
            fail();
        }
        resapp = await appservice.get(appointment_noid3.id);
        if(resapp){
            console.log("should not be here, but data found");
            fail();
        }
    });

    await t.step("update", async () => {
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
                    new QuestionnaireService(new QuestionnaireRepository(BASE))
            )));
        let res = await usecase.update(appointment3);
        if(!res.ok){
            console.log(res.errors!);
        }
        assert(res.ok);
        res = await usecase.update(appointment4);
        if(!res.ok){
            console.log(res.errors!);
        }
        assert(res.ok);
        res = await usecase.update(structuredClone(appointment_nodate2));
        if(!res.ok){
            console.log(res.errors!);
        }
        assert(res.ok);
        res = await usecase.update(structuredClone(appointment_nodate3));
        if(!res.ok){
            console.log(res.errors!);
        }
        assert(res.ok);
        res = await usecase.update(structuredClone(appointment_noid2));
        if(!res.ok){
            console.log(res.errors!);
        }
        assert(res.ok);
        res = await usecase.update(structuredClone(appointment_noid3));
        if(!res.ok){
            console.log(res.errors!);
        }
        assert(res.ok);
    });

    await t.step("count check", async () => {
        const repo = new WebReservationRepository(BASE);
        let res = await repo.read(reservation.dept, reservation.dr, reservation.date, reservation.time);
        if(res){
            assert(res.cnt === 1);
        }else{
            console.log("res1");
            fail();
        }
        res = await repo.read(reservation2.dept, reservation2.dr, reservation2.date, reservation2.time);
        if(res){
            assert(res.cnt === 0);
        }else{
            console.log("res2");
            fail();
        }
        res = await repo.read(reservation3.dept, reservation3.dr, reservation3.date, reservation3.time);
        if(res){
            assert(res.cnt === 1);
        }else{
            console.log("res3");
            fail();
        }
        res = await repo.read(reservation4.dept, reservation4.dr, reservation4.date, reservation4.time);
        if(res){
            assert(res.cnt === 3);
        }else{
            console.log("res4");
            fail();
        }
        res = await repo.read(reservation5.dept, reservation5.dr, reservation5.date, reservation5.time); if(res){
            assert(res.cnt === 3);
        }else{
            console.log("res5");
            fail();
        }
        res = await repo.read(reservation6.dept, reservation6.dr, reservation6.date, reservation6.time);
        if(res){
            assert(res.cnt === 3);
        }else{
            console.log("res6");
            fail();
        }
    });

    await t.step("list", async () => {
        const apprepo = new AppointmentRepository(BASE);
        const appservice = new AppointmentService(apprepo);
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        let res = await service.getList({fromDate:"2024-06-07", toDate: "2024-06-07"});
        if(res.length === 2){
            for(const a of res){
                if(a.id === appointment3.id){
                    assert(compare(appointment3, a));
                }else{
                    assert(compare(appointment_noid2, a));
                }
            }
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
        res = await service.getList({fromDate:"2024-06-01"});
        if(res.length === 6){
            for(const a of res){
                if(a.id === appointment3.id){
                    assert(compare(appointment3, a));
                }else if(a.id === appointment4.id){
                    assert(compare(appointment4, a));
                }else if(a.id === appointment5.id){
                    assert(compare(appointment5, a));
                }else if(a.id === appointment_noid3.id){
                    assert(compare(appointment_noid3, a));
                }else if(a.id === appointment_noid2.id){
                    assert(compare(appointment_noid2, a));
                }else if(a.id === appointment_nodate3.id){
                    assert(compare(appointment_nodate3, a));
                }else{
                    fail();
                }
            }
        }else{
            console.log(`list2: ${res.length}`)
            fail();
        }
        let res2 = await appservice.getListByDate("2024-06-07", "2024-06-07");
        if(res2.length === 2){
            for(const a of res2){
                if(a.id === appointment3.id){
                    assert(compare2(toAppointment(appointment3), a));
                }else if(a.id === appointment_noid2.id){
                    assert(compare2(toAppointment(appointment_noid2), a));
                }else{
                    fail();
                }
            }
        }else{
            console.log(`list3: ${res.length}`)
            fail();
        }
        res2 = await appservice.getListByDate("2024-06-01", "2024-07-07");
        if(res2.length === 5){
            for(const a of res2){
                if(a.id === appointment3.id){
                    assert(compare2(toAppointment(appointment3), a));
                }else if(a.id === appointment4.id){
                    assert(compare2(toAppointment(appointment4), a));
                }else if(a.id === appointment5.id){
                    assert(compare2(toAppointment(appointment5), a));
                }else if(a.id === appointment_noid2.id){
                    assert(compare2(toAppointment(appointment_noid2), a));
                }else if(a.id === appointment_nodate3.id){
                    assert(compare2(toAppointment(appointment_nodate3), a));
                }else{
                    fail();
                }
            }
        }else{
            console.log(`list4: ${res2.length}`)
            fail();
        }
        let res3 = await apprepo.list({fromDate:"2024-06-07", toDate:"2024-06-07"});
        if(res3.length === 2){
            for(const a of res3){
                if(a.id === appointment3.id){
                    assert(compare2(toAppointment(appointment3), a));
                }else if(a.id === appointment_noid2.id){
                    assert(compare2(toAppointment(appointment_noid2), a));
                }else{
                    fail();
                }
            }
        }else{
            console.log(`list5: ${res3.length}`)
            fail();
        }
        res3 = await apprepo.list({fromDate:"2024-06-01"});
        if(res3.length === 5){
            for(const a of res3){
                if(a.id === appointment3.id){
                    assert(compare2(toAppointment(appointment3), a));
                }else if(a.id === appointment4.id){
                    assert(compare2(toAppointment(appointment4), a));
                }else if(a.id === appointment5.id){
                    assert(compare2(toAppointment(appointment5), a));
                }else if(a.id === appointment_noid2.id){
                    assert(compare2(toAppointment(appointment_noid2), a));
                }else if(a.id === appointment_nodate3.id){
                    assert(compare2(toAppointment(appointment_nodate3), a));
                }else{
                    fail();
                }
            }
        }else{
            console.log(`list6: ${res3.length}`)
            fail();
        }
    })

    await t.step("patient", async () => {
        const apprepo = new AppointmentRepository(BASE);
        const appservice = new AppointmentService(apprepo);
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getList({patientId: patient.id});
        if(res.length === 2){
            for(const a of res){
                if(a.id === appointment3.id){
                    assert(compare(appointment3, a));
                }else{
                    assert(compare(appointment_nodate2, a));
                }
            }
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
        const res2 = await appservice.getListByPatient(patient4.id);
        if(res2.length === 1){
            assert(compare2(toAppointment(appointment_noid2), res2[0]));
        }
        const res3 = await service.getList({patientId: patient6.id});
        if(res.length === 2){
            for(const a of res3){
                assert(compare(appointment_nodate3, a));
            }
        }else{
            console.log(`list2: ${res.length}`)
            fail();
        }
    })

    await t.step("facility", async () => {
        const apprepo = new AppointmentRepository(BASE);
        const appservice = new AppointmentService(apprepo);
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getList({facilityId: facility2.id});
        if(res.length === 1){
            assert(compare(appointment5, res[0]));
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
        const res2 = await appservice.get(res[0].id);
        if(res2){
            assert(compare2(toAppointment(appointment5), res2));
        }
    })

    await t.step("consult", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getConsultation(facility.id);
        if(res.length === 1){
            assert(compare(appointment_nodate2, res[0]));
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
    })

    await t.step("noid", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getNoID();
        if(res.length === 1){
            assert(compare(appointment_noid3, res[0]));
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
    })

    await t.step("delete", async () => {
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
                    new QuestionnaireService(new QuestionnaireRepository(BASE))
            )));
        await usecase.delete(appointment3);
        let res = await repo.read(appointment3.id);
        assertFalse(res);
        let res2 = await service.get(appointment3.id);
        assertFalse(res2);
        await usecase.delete(appointment4);
        res = await repo.read(appointment4.id);
        assertFalse(res);
        res2 = await service.get(appointment4.id);
        assertFalse(res2);
        await usecase.delete(appointment5);
        res = await repo.read(appointment5.id);
        assertFalse(res);
        res2 = await service.get(appointment5.id);
        assertFalse(res2);
        await usecase.delete(appointment_nodate2);
        res = await repo.read(appointment_nodate2.id);
        assertFalse(res);
        await usecase.delete(appointment_nodate3);
        res = await repo.read(appointment_nodate3.id);
        assertFalse(res);
        res2 = await service.get(appointment_nodate3.id);
        assertFalse(res2);
        assertFalse(res);
        await usecase.delete(appointment_noid2);
        res = await repo.read(appointment_noid2.id);
        assertFalse(res);
        res2 = await service.get(appointment_noid2.id);
        assertFalse(res2);
        await usecase.delete(appointment_noid3);
        res = await repo.read(appointment_noid3.id);
    });

    await t.step("cleanup", async () => {
        const repo = new WebReservationRepository(BASE);
        await repo.delete(reservation);
        await repo.delete(reservation2);
        await repo.delete(reservation3);
        await repo.delete(reservation4);
        await repo.delete(reservation5);
    });
});