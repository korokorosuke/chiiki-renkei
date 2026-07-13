import { assert, assertFalse, fail } from "@std/assert"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import { ReplyRepository } from "../infra/replyRepository.ts"
import { ReplyService, ReplyListService } from "./replyService.ts "
import type { Reply } from "./reply.ts"
import { referral, referral2, referral3, reply, reply2, reply3, reply4 } from
    "../infra/testdata/reply.ts"
import { patient } from "../infra/testdata/patient.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

function compare(r1: Reply, r2: Reply): boolean {
    if(r1.id !== r2.id){
        console.log(`id: ${r1.id} : ${r2.id}`)
        return false;
    }
    if(r1.date !== r2.date){
        console.log(`date: ${r1.date} : ${r2.date}`)
        return false;
    }
    if(r1.memo !== r2.memo){
        console.log(`memo: ${r1.memo} : ${r2.memo}`)
        return false;
    }
    if(r1.personInCharge && r2.personInCharge){
        const p1 = r1.personInCharge;
        const p2 = r2.personInCharge;
        if(p1.id !== p2.id){
            console.log(`personInCharge_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`personInCharge_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    if(r1.department && r2.department){
        const p1 = r1.department;
        const p2 = r2.department;
        if(p1.id !== p2.id){
            console.log(`department_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`department_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    if(r1.dr && r2.dr){
        const p1 = r1.dr;
        const p2 = r2.dr;
        if(p1.id !== p2.id){
            console.log(`dr_id: ${p1.id} : ${p2.id}`)
            return false;
        }
        if(p1.name !== p2.name){
            console.log(`dr_name: ${p1.name} : ${p2.name}`)
            return false;
        }
    }
    return true;
}

Kv.test = true;

Deno.test("reply service", async (t) => {
    await t.step("insert", async () => {
        const repo = new AppointmentRepository(BASE);
        let res1 = await repo.insert(referral);
        assert(res1);
        res1 = await repo.insert(referral2);
        assert(res1);
        res1 = await repo.insert(referral3);
        assert(res1);
        const rerepo = new ReplyRepository(BASE);
        const service = new ReplyService(rerepo);
        let res = await service.insert(reply);
        assert(res.ok);
        if(res.data){
          reply.id = res.data;
        }else{
          fail();
        }
        res = await service.insert(reply2);
        assert(res.ok);
        if(res.data){
          reply2.id = res.data;
        }else{
          fail();
        }
        res = await service.insert(reply3);
        assert(res.ok);
        if(res.data){
          reply3.id = res.data;
          reply4.id = res.data;
        }else{
          fail();
        }
    });

    await t.step("update", async () => {
        const repo = new ReplyRepository(BASE);
        const service = new ReplyService(repo);
        const res = await service.update(reply4);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const rerepo = new ReplyRepository(BASE);
        const service = new ReplyListService(rerepo);
        let res = await service.get(reply.id);
        if(res && res.replies && res.replies.length > 0){
            assert(compare(reply, res.replies[0]));
        }else{
            fail();
        }
        res = await service.get(reply2.id);
        if(res && res.replies && res.replies.length > 0){
            assert(compare(reply2, res.replies[0]));
        }else{
            fail();
        }
        res = await service.get(reply4.id);
        if(res && res.replies && res.replies.length > 0){
            assert(compare(reply4, res.replies[0]));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const rerepo = new ReplyRepository(BASE);
        const service = new ReplyListService(rerepo);
        let res = await service.getListByDate("2024-06-07", "2024-06-15");
        if(res.length === 3){
            for(const ref of res){
                let exist = false;
                for(const rep of ref.replies){
                    if(rep.id === reply.id){
                        assert(compare(reply, rep));
                    }else if(rep.id === reply2.id){
                        assert(compare(reply2, rep));
                    }else if(rep.id === reply4.id){
                        assert(compare(reply4, rep));
                    }else{
                        fail();
                    }
                    exist = true;
                }
                if(!exist){
                  assert(ref.id === referral3.id);
                }
            }
        }else{
            for(const rep of res){
                console.log(rep);
            }
            console.log(`list1: ${res.length}`)
            fail();
        }
        res = await service.getListByDate("2024-06-08", "2024-06-14");
        if(res.length === 2){
            for(const ref of res){
                let exist = false;
                for(const rep of ref.replies){
                    if(rep.id === reply2.id){
                        assert(compare(reply2, rep));
                    }
                    exist = true;
                }
                if(!exist){
                  assert(ref.id === referral3.id);
                }
            }
        }else{
            for(const rep of res){
                console.log(rep);
            }
            console.log(`list2: ${res.length}`)
            fail();
        }
    });

    await t.step("patient", async () => {
        const rerepo = new ReplyRepository(BASE);
        const service = new ReplyListService(rerepo);
        const res = await service.getListByPatient(patient.id);
        if(res.length === 2){
            for(const ref of res){
                let exist = false;
                for(const rep of ref.replies){
                    if(rep.id === reply.id){
                        assert(compare(reply, rep));
                    }else if(rep.id === reply4.id){
                        assert(compare(reply4, rep));
                    }else{
                        fail();
                    }
                    exist = true;
                }
                if(!exist){
                    assert(ref.id === referral3.id);
                }
            }
        }else{
            for(const rep of res){
                console.log(rep);
            }
            console.log(`list1: ${res.length}`)
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new AppointmentRepository(BASE);
        await repo.delete(referral);
        let res = await repo.read(referral.id);
        assertFalse(res);
        await repo.delete(referral3);
        res = await repo.read(referral3.id);
        assertFalse(res);
        await repo.delete(referral2);
        res = await repo.read(referral2.id);
        assertFalse(res);
        const rerepo = new ReplyRepository(BASE);
        const service = new ReplyService(rerepo);
        await service.delete(reply);
        let res2 = await rerepo.read(reply.id);
        assertFalse(res2);
        await service.delete(reply2);
        res2 = await rerepo.read(reply2.id);
        assertFalse(res2);
        await service.delete(reply4);
        res2 = await rerepo.read(reply4.id);
        assertFalse(res2);
    });
});