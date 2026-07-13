import { assert, assertFalse, fail } from "@std/assert"
import { WebReservationRepository } from "../infra/webReservationRepository.ts"
import { WebReservationService } from "./webReservationService.ts"
import type { WebReservation } from "../domain/webReservation.ts"
import { reservation, reservation2, reservation3, reservation4, reservation5 }
    from "../infra/testdata/webReservation.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(u1: WebReservation, u2: WebReservation): boolean {
    if(u1.dept !== u2.dept){
        return false;
    }
    if(u1.dr !== u2.dr){
        return false;
    }
    if(u1.date !== u2.date){
        return false;
    }
    if(u1.time !== u2.time){
        return false;
    }
    if(u1.max !== u2.max){
        return false;
    }
    if(u1.cnt !== u2.cnt){
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("webreservation service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new WebReservationRepository(BASE);
        const service = new WebReservationService(repo);
        let res = await service.insert(reservation);
        assert(res.ok);
        res = await service.insert(reservation2);
        assert(res.ok);
        res = await service.insert(reservation4);
        assert(res.ok);
        res = await service.insert(reservation5);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new WebReservationRepository(BASE);
        const service = new WebReservationService(repo);
        const res = await service.update(reservation3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new WebReservationRepository(BASE);
        const service = new WebReservationService(repo);
        let res = await service.get(reservation3.dept, reservation3.dr,
            reservation3.date, reservation3.time);
        if(res){
            assert(compare(reservation3, res));
        }else{
            fail();
        }
        res = await service.get(reservation2.dept, reservation2.dr,
            reservation2.date, reservation2.time);
        if(res){
            assert(compare(reservation2, res));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const repo = new WebReservationRepository(BASE);
        const service = new WebReservationService(repo);
        let res = await service.getListByDate("02", "2024-08");
        if(res.length === 2){
            assert(compare(reservation2, res[0]));
            assert(compare(reservation4, res[1]));
        }else{
            console.log(`list1: ${res.length}`)
            fail();
        }
        res = await service.getListByDate("01", "2024-08");
        if(res.length === 1){
            assert(compare(reservation3, res[0]));
        }else{
            console.log(res);
            console.log(`list2: ${res.length}`)
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new WebReservationRepository(BASE);
        const service = new WebReservationService(repo);
        await service.delete(reservation3);
        let res = await service.get(reservation3.dept, reservation3.dr,
            reservation3.date, reservation3.time);
        assertFalse(res);
        await service.delete(reservation2);
        res = await service.get(reservation2.dept, reservation2.dr,
            reservation2.date, reservation2.time);
        assertFalse(res);
        await service.delete(reservation4);
        res = await service.get(reservation4.dept, reservation4.dr,
            reservation4.date, reservation4.time);
        assertFalse(res);
        await service.delete(reservation5);
        res = await service.get(reservation5.dept, reservation5.dr,
            reservation5.date, reservation5.time);
        assertFalse(res);
    });
});