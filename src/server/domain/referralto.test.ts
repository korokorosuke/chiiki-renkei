import { describe, test, expect } from "vitest"
import { ReferralToRepository } from "../infra/referraltoRepository.ts"
import { ReferralToService } from "./referraltoService.ts"
import { toReferralTo } from "../lib/types.ts"
import { appointment, appointment2, appointment3, appointment4 } from "../infra/testdata/appointment.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

const referralto = toReferralTo(appointment);
const referralto2 = toReferralTo(appointment2);
const referralto3 = toReferralTo(appointment3);
const referralto4 = toReferralTo(appointment4);

Kv.test = true;

describe("referralto service", () => {
    test("insert", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        referralto.id = "";
        referralto2.id = "";
        let res = await service.insert(referralto);
        expect(res.ok).toBe(true);
        let list = await service.getListByDate("2024-06-01", "");
        if(!list[0].id){
            expect.fail("id is not set");
        }
        referralto3.id = list[0].id;
        res = await service.insert(referralto2);
        expect(res.ok).toBe(true);
        list = await service.getListByDate("2024-06-01", "");
        for(const r of list){
            if(r.id !== referralto3.id){
                referralto4.id = r.id;
                break;
            }
        }
    });

    test("update", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        let res = await service.update(referralto3);
        expect(res.ok).toBe(true);
        res = await service.update(referralto4);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        let res = await service.get(referralto3.id);
        expect(referralto3).toEqual(res);
        res = await service.get(referralto4.id);
        expect(referralto4).toEqual(res);
    });

    test("list", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        let res = await service.getListByDate("2024-06-07", "2024-06-07");
        if(res.length === 1){
            expect(referralto3).toEqual(res[0]);
        }else{
            console.log(res[0]);
            console.log(res[1]);
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getListByDate("2024-06-01", "");
        if(res.length === 2){
            expect(referralto3).toEqual(res[0]);
            expect(referralto4).toEqual(res[1]);
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    });

    test("patient", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        const res = await service.getListByPatient(referralto3.patient.id);
        if(res.length === 1){
            expect(referralto3).toEqual(res[0]);
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
    });

    test("delete", async () => {
        const repo = new ReferralToRepository(BASE);
        const service = new ReferralToService(repo);
        await service.delete(referralto3);
        let res = await service.get(referralto3.id);
        expect(res).toBeUndefined();
        await service.delete(referralto2);
        res = await service.get(referralto2.id);
        expect(res).toBeUndefined();
    });
});