import { describe, test, expect } from "vitest"
import { PatientRepository } from "../infra/patientRepository.ts"
import { PatientService } from "./patientService.ts"
import { patient, patient2, patient3 } from "../infra/testdata/patient.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("patient service", () => {
    test("insert", async()=>{
        const repo = new PatientRepository(BASE);
        const service = new PatientService(repo);
        let res = await service.insert(patient);
        expect(res.ok).toBe(true);
        res = await service.insert(patient2);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new PatientRepository(BASE);
        const service = new PatientService(repo);
        const res = await service.update(patient3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new PatientRepository(BASE);
        const service = new PatientService(repo);
        let res = await service.get(patient.id);
        expect(patient3).toEqual(res);
        res = await service.get(patient2.id);
        expect(patient2).toEqual(res);
    });

    test("list", async () => {
        const repo = new PatientRepository(BASE);
        const res = await repo.list({name: patient3.firstName});
        if(res.length === 1){
            expect(patient3).toEqual(res[0]);
        }else{
            console.log(res.length);
            expect.fail();
        }
    });

    test("delete", async () => {
        const repo = new PatientRepository(BASE);
        await repo.delete(patient);
        let res = await repo.read(patient.id);
        expect(res).toBeUndefined();
        await repo.delete(patient2);
        res = await repo.read(patient2.id);
        expect(res).toBeUndefined();
    });
});