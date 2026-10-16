import { describe, test, expect } from "vitest"
import { WebAppRepository } from "../infra/webAppointmentRepository.ts"
import type { WebAppointment } from "./webAppointment.ts"
import { facility, facility2, toFac } from "../infra/testdata/facility.ts"
import { patient, patient2, patient6, patient4, patientNoId } from "../infra/testdata/patient.ts"
import { dr, dr2 } from "../infra/testdata/webDr.ts"
import { department, department2 } from "../infra/testdata/webDept.ts"
import { user } from "../infra/testdata/user.ts"
import { initWebDr } from "../lib/types.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"
import { WebAppService } from "./webAppointmentService.ts"

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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-06T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:38:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
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
    createdAt: "2024-06-07T12:34:56Z",
    updatedBy: user,
    updatedAt: "2024-06-07T12:34:56Z",
}

Kv.test = true;

function omitTimestamps(val: WebAppointment): Omit<WebAppointment, "createdAt" | "updatedAt"> {
  const {createdAt, updatedAt, ...value} = val;
  return value;
}

describe("webappointment service", () => {
    test("insert", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        let res = await service.insert(appointment);
        expect(res.ok).toBe(true);
        if(res.ok){
            appointment3.id = res.data.id;
        }
        res = await service.insert(appointment2);
        expect(res.ok).toBe(true);
        if(res.ok){
            appointment4.id = res.data.id;
        }
        res = await service.insert(appointment5);
        expect(res.ok).toBe(true);
        if(res.ok){
            appointment5.id = res.data.id;
        }
        res = await service.insert(structuredClone(appointment_nodate));
        expect(res.ok).toBe(true);
        if(res.ok){
            appointment_nodate2.id = res.data.id;
        }
        res = await service.insert(structuredClone(appointment_nodate1));
        expect(res.ok).toBe(true);
        if(res.ok){
            appointment_nodate3.id = res.data.id;
        }
        res = await service.insert(structuredClone(appointment_noid));
        expect(res.ok).toBe(true);
        if(res.ok){
            appointment_noid2.id = res.data.id;
        }
        res = await service.insert(structuredClone(appointment_noid1));
        expect(res.ok).toBe(true);
        if(res.ok){
            appointment_noid3.id = res.data.id;
        }
    });

    test("update", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        let res = await service.update(appointment3);
        expect(res.ok).toBe(true);
        res = await service.update(appointment4);
        expect(res.ok).toBe(true);
        res = await service.update(structuredClone(appointment_nodate2));
        expect(res.ok).toBe(true);
        res = await service.update(structuredClone(appointment_nodate3));
        expect(res.ok).toBe(true);
        res = await service.update(structuredClone(appointment_noid2));
        expect(res.ok).toBe(true);
        res = await service.update(structuredClone(appointment_noid3));
        expect(res.ok).toBe(true);
    });

    test("list", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        let res = await service.getList({fromDate:"2024-06-07", toDate: "2024-06-07"});
        if(res.length === 2){
            for(const a of res){
                if(a.id === appointment3.id){
                    expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(a));
                }else{
                    expect(omitTimestamps(appointment_noid2)).toEqual(omitTimestamps(a));
                }
            }
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getList({fromDate:"2024-06-01"});
        if(res.length === 6){
            for(const a of res){
                if(a.id === appointment3.id){
                    expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(a));
                }else if(a.id === appointment4.id){
                    expect(omitTimestamps(appointment4)).toEqual(omitTimestamps(a));
                }else if(a.id === appointment5.id){
                    expect(omitTimestamps(appointment5)).toEqual(omitTimestamps(a));
                }else if(a.id === appointment_noid3.id){
                    expect(omitTimestamps(appointment_noid3)).toEqual(omitTimestamps(a));
                }else if(a.id === appointment_noid2.id){
                    expect(omitTimestamps(appointment_noid2)).toEqual(omitTimestamps(a));
                }else if(a.id === appointment_nodate3.id){
                    expect(omitTimestamps(appointment_nodate3)).toEqual(omitTimestamps(a));
                }else{
                    expect.fail();
                }
            }
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    });

    test("patient", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getList({patientId: patient.id});
        if(res.length === 2){
            for(const a of res){
                if(a.id === appointment3.id){
                    expect(omitTimestamps(appointment3)).toEqual(omitTimestamps(a));
                }else{
                    expect(omitTimestamps(appointment_nodate2)).toEqual(omitTimestamps(a));
                }
            }
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        const res3 = await service.getList({patientId: patient6.id});
        if(res.length === 2){
            for(const a of res3){
                expect(omitTimestamps(appointment_nodate3)).toEqual(omitTimestamps(a));
            }
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    });

    test("facility", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getList({facilityId: facility2.id});
        if(res.length === 1){
            expect(omitTimestamps(appointment5)).toEqual(omitTimestamps(res[0]));
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
    });

    test("consult", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getConsultation(facility.id);
        if(res.length === 1){
            expect(omitTimestamps(appointment_nodate2)).toEqual(omitTimestamps(res[0]));
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
    });

    test("noid", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        const res = await service.getNoID();
        if(res.length === 1){
            expect(omitTimestamps(appointment_noid3)).toEqual(omitTimestamps(res[0]));
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
    });

    test("delete", async () => {
        const repo = new WebAppRepository(BASE);
        const service = new WebAppService(repo);
        await service.delete(appointment3);
        let res = await repo.read(appointment3.id);
        expect(res).toBeUndefined();
        let res2 = await service.get(appointment3.id);
        expect(res2).toBeUndefined();
        await service.delete(appointment4);
        res = await repo.read(appointment4.id);
        expect(res).toBeUndefined();
        res2 = await service.get(appointment4.id);
        expect(res2);
        await service.delete(appointment5);
        res = await repo.read(appointment5.id);
        expect(res).toBeUndefined();
        res2 = await service.get(appointment5.id);
        expect(res2).toBeUndefined();
        await service.delete(appointment_nodate2);
        res = await repo.read(appointment_nodate2.id);
        expect(res).toBeUndefined();
        await service.delete(appointment_nodate3);
        res = await repo.read(appointment_nodate3.id);
        expect(res).toBeUndefined();
        res2 = await service.get(appointment_nodate3.id);
        expect(res2).toBeUndefined();
        expect(res).toBeUndefined();
        await service.delete(appointment_noid2);
        res = await repo.read(appointment_noid2.id);
        expect(res).toBeUndefined();
        res2 = await service.get(appointment_noid2.id);
        expect(res2).toBeUndefined();
        await service.delete(appointment_noid3);
        res = await repo.read(appointment_noid3.id);
    });
});