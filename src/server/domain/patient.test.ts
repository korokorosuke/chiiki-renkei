import { assert, assertFalse, fail } from "@std/assert"
import { PatientRepository } from "../infra/patientRepository.ts"
import { PatientService } from "./patientService.ts"
import type { Patient } from "./patient.ts"
import { patient, patient2, patient3 } from "../infra/testdata/patient.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: Patient, u2: Patient): boolean {
    if(u1.id !== u2.id){
        console.log(`id: ${u1.id} : ${u2.id}`);
        return false;
    }
    if(u1.lastName !== u2.lastName){
        console.log(`name: ${u1.lastName} : ${u2.lastName}`);
        return false;
    }
    if(u1.firstName !== u2.firstName){
        console.log(`name: ${u1.firstName} : ${u2.firstName}`);
        return false;
    }
    if(u1.lastKana !== u2.lastKana){
        console.log(`name: ${u1.lastKana} : ${u2.lastKana}`);
        return false;
    }
    if(u1.firstKana !== u2.firstKana){
        console.log(`name: ${u1.firstKana} : ${u2.firstKana}`);
        return false;
    }
    if(u1.sex !== u2.sex){
        console.log(`sex: ${u1.sex} : ${u2.sex}`);
        return false;
    }
    if(u1.birthday !== u2.birthday){
        console.log(`birthday: ${u1.birthday} : ${u2.birthday}`);
        return false;
    }
    if(u1.tel !== u2.tel){
        console.log(`tel: ${u1.tel} : ${u2.tel}`);
        return false;
    }
    if(u1.address.postalCode !== u2.address.postalCode){
        console.log(`postalCode: ${u1.address.postalCode} : ${u2.address.postalCode}`);
        return false;
    }
    if(u1.address.plus !== u2.address.plus){
        console.log(`plus: ${u1.address.plus} : ${u2.address.plus}`);
        return false;
    }
    if(u1.memo !== u2.memo){
        console.log(`memo: ${u1.memo} : ${u2.memo}`);
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("patient service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new PatientRepository(BASE);
        const service = new PatientService(repo);
        let res = await service.insert(patient);
        assert(res.ok);
        res = await service.insert(patient2);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new PatientRepository(BASE);
        const service = new PatientService(repo);
        const res = await service.update(patient3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new PatientRepository(BASE);
        const service = new PatientService(repo);
        let res = await service.get(patient.id);
        if(res){
            assert(compare(patient3, res));
        }else{
            fail();
        }
        res = await service.get(patient2.id);
        if(res){
            assert(compare(patient2, res));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const repo = new PatientRepository(BASE);
        const res = await repo.list({name: patient3.firstName});
        if(res.length === 1){
            assert(compare(patient3, res[0]));
        }else{
            console.log(res.length);
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new PatientRepository(BASE);
        await repo.delete(patient);
        let res = await repo.read(patient.id);
        assertFalse(res);
        await repo.delete(patient2);
        res = await repo.read(patient2.id);
        assertFalse(res);
    });
});