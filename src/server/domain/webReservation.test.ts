import { describe, test, expect } from "vitest"
import { WebReservationRepository } from "../infra/webReservationRepository.ts"
import { WebReservationService } from "./webReservationService.ts"
import { reservation, reservation2, reservation3, reservation4, reservation5 }
    from "../infra/testdata/webReservation.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("webreservation service", () => {
    test("insert", async()=>{
        const repo = new WebReservationRepository(BASE);
        const service = new WebReservationService(repo);
        let res = await service.insert(reservation);
        expect(res.ok).toBe(true);
        res = await service.insert(reservation2);
        expect(res.ok).toBe(true);
        res = await service.insert(reservation4);
        expect(res.ok).toBe(true);
        res = await service.insert(reservation5);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new WebReservationRepository(BASE);
        const service = new WebReservationService(repo);
        const res = await service.update(reservation3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new WebReservationRepository(BASE);
        const service = new WebReservationService(repo);
        let res = await service.get(reservation3.dept, reservation3.dr,
            reservation3.date, reservation3.time);
        expect(reservation3).toEqual(res);
        res = await service.get(reservation2.dept, reservation2.dr,
            reservation2.date, reservation2.time);
        expect(reservation2).toEqual(res);
    });

    test("list", async () => {
        const repo = new WebReservationRepository(BASE);
        const service = new WebReservationService(repo);
        let res = await service.getListByDate("02", "2024-08");
        if(res.length === 2){
            expect(reservation2).toEqual(res[0]);
            expect(reservation4).toEqual(res[1]);
        }else{
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getListByDate("01", "2024-08");
        if(res.length === 1){
            expect(reservation3).toEqual(res[0]);
        }else{
            console.log(res);
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    });

    test("delete", async () => {
        const repo = new WebReservationRepository(BASE);
        const service = new WebReservationService(repo);
        await service.delete(reservation3);
        let res = await service.get(reservation3.dept, reservation3.dr,
            reservation3.date, reservation3.time);
        expect(res).toBeUndefined();
        await service.delete(reservation2);
        res = await service.get(reservation2.dept, reservation2.dr,
            reservation2.date, reservation2.time);
        expect(res).toBeUndefined();
        await service.delete(reservation4);
        res = await service.get(reservation4.dept, reservation4.dr,
            reservation4.date, reservation4.time);
        expect(res).toBeUndefined();
        await service.delete(reservation5);
        res = await service.get(reservation5.dept, reservation5.dr,
            reservation5.date, reservation5.time);
        expect(res).toBeUndefined();
    });
});