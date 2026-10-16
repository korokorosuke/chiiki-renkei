import { describe, test, expect } from "vitest"
import { ActivityRepository } from "../infra/activityRepository.ts"
import { ActivityService } from "./activityService.ts"
import { activity, activity2, activity3, activity4, activity5, activity6 }
    from "../infra/testdata/activity.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("activity service", () => {
    test("insert", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        activity.id = "";
        let res = await service.insert(activity);
        expect(res.ok).toBe(true);
        let list = await service.getList({fromDate:"2024-06-01"});
        if(!list[0].id){
            expect.fail("id is not set");
        }
        activity3.id = list[0].id;
        res = await service.insert(activity2);
        expect(res.ok).toBe(true);
        list = await service.getList({fromDate:"2024-06-01"});
        for(const a of list){
            if(a.id !== activity3.id){
                activity4.id = a.id;
            }
        }
        res = await service.insert(activity5);
        expect(res.ok).toBe(true);
        list = await service.getList({fromDate:"2024-06-01"});
        for(const a of list){
            if(a.id !== activity3.id && a.id !== activity4.id){
                activity6.id = a.id;
            }
        }
    });

    test("update", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        let res = await service.update(activity3);
        expect(res.ok).toBe(true);
        res = await service.update(activity4);
        expect(res.ok).toBe(true);
        res = await service.update(activity6);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        let res = await service.get(activity3.id);
        expect(activity3).toEqual(res);
        res = await service.get(activity4.id);
        expect(activity4).toEqual(res);
        res = await service.get(activity6.id);
        expect(activity6).toEqual(res);
    });

    test("list", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        let res = await service.getList({fromDate:"2024-06-10", toDate: "2024-06-10"});
        if(res.length === 1){
            expect(activity3).toEqual(res[0]);
        }else{
            console.log(res[0]);
            console.log(res[1]);
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getList({fromDate:"2024-06-01"});
        if(res.length === 3){
            expect(activity4).toEqual(res[0]);
            expect(activity6).toEqual(res[1]);
            expect(activity3).toEqual(res[2]);
        }else{
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    })

    test("facility", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        let res = await service.getList({facilityId: "0001"});
        if(res.length === 2){
            expect(activity3).toEqual(res[0]);
            expect(activity6).toEqual(res[1]);
        }else{
            console.log(`facility1: ${res.length}`)
            expect.fail();
        }
        res = await service.getList({facilityId: "0002"});
        if(res.length === 1){
            expect(activity4).toEqual(res[0]);
        }else{
            console.log(`facility2: ${res.length}`)
            expect.fail();
        }
    })

    test("delete", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        await service.delete(activity3);
        let res = await service.get(activity3.id);
        expect(res).toBeUndefined();
        await service.delete(activity4);
        res = await service.get(activity4.id);
        expect(res).toBeUndefined();
        await service.delete(activity6);
        res = await service.get(activity6.id);
        expect(res).toBeUndefined();
    });
});