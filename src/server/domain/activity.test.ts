import { assert, assertFalse, fail } from "@std/assert"
import { ActivityRepository } from "../infra/activityRepository.ts"
import { ActivityService } from "./activityService.ts"
import type { Activity } from "./activity.ts"
import { activity, activity2, activity3, activity4, activity5, activity6 }
    from "../infra/testdata/activity.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(val1: Activity, val2: Activity): boolean {
    if(val1.id !== val2.id){
        console.log(`id: ${val1.id} : ${val2.id}`)
        return false;
    }
    if(val1.date !== val2.date){
        console.log(`date: ${val1.date} : ${val2.date}`)
        return false;
    }
    if(val1.toDate !== val2.toDate){
        console.log(`toDate: ${val1.toDate} : ${val2.toDate}`)
        return false;
    }
    if(val1.participants !== val2.participants){
        console.log(`participants: ${val1.participants} : ${val2.participants}`)
        return false;
    }
    if(val1.facilityParticipants !== val2.facilityParticipants){
        console.log(`facilityParticipants: ${val1.facilityParticipants} : ${val2.facilityParticipants}`)
        return false;
    }
    if(val1.facility && val2.facility){
        const v1 = val1.facility;
        const v2 = val2.facility;
        if(v1.id !== v2.id){
            console.log(`facility_id: ${v1.id} : ${v2.id}`)
            return false;
        }
        if(v1.name !== v2.name){
            console.log(`facility_name: ${v1.name} : ${v2.name}`)
            return false;
        }
    }
    if(val1.purpose.length !== val2.purpose.length){
        console.log(`purpose: ${val1.purpose} : ${val2.purpose}`)
    }else{
        for(const p of val1.purpose){
            if(!val2.purpose.includes(p)){
                console.log(`purpose: ${p} : ${val2.purpose}`)
                return false;
            }
        }
    }
    return true;
}

Kv.test = true;

Deno.test("activity service", async (t) => {
    await t.step("insert", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        activity.id = "";
        let res = await service.insert(activity);
        assert(res.ok);
        let list = await service.getList({fromDate:"2024-06-01"});
        if(!list[0].id){
            fail("id is not set");
        }
        activity3.id = list[0].id;
        res = await service.insert(activity2);
        assert(res.ok);
        list = await service.getList({fromDate:"2024-06-01"});
        for(const a of list){
            if(a.id !== activity3.id){
                activity4.id = a.id;
            }
        }
        res = await service.insert(activity5);
        assert(res.ok);
        list = await service.getList({fromDate:"2024-06-01"});
        for(const a of list){
            if(a.id !== activity3.id && a.id !== activity4.id){
                activity6.id = a.id;
            }
        }
    });

    await t.step("update", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        let res = await service.update(activity3);
        assert(res.ok);
        res = await service.update(activity4);
        assert(res.ok);
        res = await service.update(activity6);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        let res = await service.get(activity3.id);
        if(res){
            assert(compare(activity3, res));
        }else{
            fail();
        }
        res = await service.get(activity4.id);
        if(res){
            assert(compare(activity4, res));
        }else{
            fail();
        }
        res = await service.get(activity6.id);
        if(res){
            assert(compare(activity6, res));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        let res = await service.getList({fromDate:"2024-06-10", toDate: "2024-06-10"});
        if(res.length === 1){
            assert(compare(activity3, res[0]));
        }else{
            console.log(res[0]);
            console.log(res[1]);
            console.log(`list1: ${res.length}`)
            fail();
        }
        res = await service.getList({fromDate:"2024-06-01"});
        if(res.length === 3){
            assert(compare(activity4, res[0]));
            assert(compare(activity6, res[1]));
            assert(compare(activity3, res[2]));
        }else{
            console.log(`list2: ${res.length}`)
            fail();
        }
    })

    await t.step("facility", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        let res = await service.getList({facilityId: "0001"});
        if(res.length === 2){
            assert(compare(activity3, res[0]));
            assert(compare(activity6, res[1]));
        }else{
            console.log(`facility1: ${res.length}`)
            fail();
        }
        res = await service.getList({facilityId: "0002"});
        if(res.length === 1){
            assert(compare(activity4, res[0]));
        }else{
            console.log(`facility2: ${res.length}`)
            fail();
        }
    })

    await t.step("delete", async () => {
        const repo = new ActivityRepository(BASE);
        const service = new ActivityService(repo);
        await service.delete(activity3);
        let res = await service.get(activity3.id);
        assertFalse(res);
        await service.delete(activity4);
        res = await service.get(activity4.id);
        assertFalse(res);
        await service.delete(activity6);
        res = await service.get(activity6.id);
        assertFalse(res);
    });
});