import { describe, test, expect } from "vitest"
import { AppointmentRepository } from "../infra/appointmentRepository.ts"
import { ReplyRepository } from "../infra/replyRepository.ts"
import { ReplyService, ReplyListService } from "./replyService.ts"
import { referral, referral2, referral3, reply, reply2, reply3, reply4 } from
    "../infra/testdata/reply.ts"
import { patient } from "../infra/testdata/patient.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("reply service", () => {
    test("insert", async () => {
        const repo = new AppointmentRepository(BASE);
        let res1 = await repo.insert(referral);
        expect(res1).toBe(true);
        res1 = await repo.insert(referral2);
        expect(res1).toBe(true);
        res1 = await repo.insert(referral3);
        expect(res1).toBe(true);
        const rerepo = new ReplyRepository(BASE);
        const service = new ReplyService(rerepo);
        let res = await service.insert(reply);
        expect(res.ok).toBe(true);
        if(res.ok && res.data){
          reply.id = res.data;
        }else{
          expect.fail();
        }
        res = await service.insert(reply2);
        expect(res.ok).toBe(true);
        if(res.ok && res.data){
          reply2.id = res.data;
        }else{
          expect.fail();
        }
        res = await service.insert(reply3);
        expect(res.ok).toBe(true);
        if(res.ok && res.data){
          reply3.id = res.data;
          reply4.id = res.data;
        }else{
          expect.fail();
        }
    });

    test("update", async () => {
        const repo = new ReplyRepository(BASE);
        const service = new ReplyService(repo);
        const res = await service.update(reply4);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const rerepo = new ReplyRepository(BASE);
        const service = new ReplyListService(rerepo);
        let res = await service.get(reply.id);
        if(res && res.replies && res.replies.length > 0){
            expect(reply).toEqual(res.replies[0]);
        }else{
            expect.fail();
        }
        res = await service.get(reply2.id);
        if(res && res.replies && res.replies.length > 0){
            expect(reply2).toEqual(res.replies[0]);
        }else{
            expect.fail();
        }
        res = await service.get(reply4.id);
        if(res && res.replies && res.replies.length > 0){
            expect(reply4).toEqual(res.replies[0]);
        }else{
            expect.fail();
        }
    });

    test("list", async () => {
        const rerepo = new ReplyRepository(BASE);
        const service = new ReplyListService(rerepo);
        let res = await service.getListByDate("2024-06-07", "2024-06-15");
        if(res.length === 3){
            for(const ref of res){
                let exist = false;
                for(const rep of ref.replies){
                    if(rep.id === reply.id){
                        expect(reply).toEqual(rep);
                    }else if(rep.id === reply2.id){
                        expect(reply2).toEqual(rep);
                    }else if(rep.id === reply4.id){
                        expect(reply4).toEqual(rep);
                    }else{
                        expect.fail();
                    }
                    exist = true;
                }
                if(!exist){
                  expect(ref.id).toBe(referral3.id);
                }
            }
        }else{
            for(const rep of res){
                console.log(rep);
            }
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
        res = await service.getListByDate("2024-06-08", "2024-06-14");
        if(res.length === 2){
            for(const ref of res){
                let exist = false;
                for(const rep of ref.replies){
                    if(rep.id === reply2.id){
                        expect(reply2).toEqual(rep);
                    }
                    exist = true;
                }
                if(!exist){
                  expect(ref.id).toBe(referral3.id);
                }
            }
        }else{
            for(const rep of res){
                console.log(rep);
            }
            console.log(`list2: ${res.length}`)
            expect.fail();
        }
    });

    test("patient", async () => {
        const rerepo = new ReplyRepository(BASE);
        const service = new ReplyListService(rerepo);
        const res = await service.getListByPatient(patient.id);
        if(res.length === 2){
            for(const ref of res){
                let exist = false;
                for(const rep of ref.replies){
                    if(rep.id === reply.id){
                        expect(reply).toEqual(rep);
                    }else if(rep.id === reply4.id){
                        expect(reply4).toEqual(rep);
                    }else{
                        expect.fail();
                    }
                    exist = true;
                }
                if(!exist){
                    expect(ref.id).toBe(referral3.id);
                }
            }
        }else{
            for(const rep of res){
                console.log(rep);
            }
            console.log(`list1: ${res.length}`)
            expect.fail();
        }
    });

    test("delete", async () => {
        const repo = new AppointmentRepository(BASE);
        await repo.delete(referral);
        let res = await repo.read(referral.id);
        expect(res).toBeUndefined();
        await repo.delete(referral3);
        res = await repo.read(referral3.id);
        expect(res).toBeUndefined();
        await repo.delete(referral2);
        res = await repo.read(referral2.id);
        expect(res).toBeUndefined();
        const rerepo = new ReplyRepository(BASE);
        const service = new ReplyService(rerepo);
        await service.delete(reply);
        let res2 = await rerepo.read(reply.id);
        expect(res2).toBeUndefined();
        await service.delete(reply2);
        res2 = await rerepo.read(reply2.id);
        expect(res2).toBeUndefined();
        await service.delete(reply4);
        res2 = await rerepo.read(reply4.id);
        expect(res2).toBeUndefined();
    });
});