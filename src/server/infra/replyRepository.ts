/// <reference lib="deno.unstable" />
import type { Reply, Condition } from "../domain/reply.ts"
import type { Referral } from "../domain/referral.ts"
import type { IReplyRepository } from "../domain/replyService.ts"
import { toReferral } from "../lib/types.ts"
import { AppointmentRepository } from "./appointmentRepository.ts"
import { Kv } from "./kv.ts"

export class ReplyRepository implements IReplyRepository {
    database: Kv
    base: string
    KEY: string = "reply"
    KEY2: string = "reply_ref"
    constructor(base: string){
        this.database = new Kv();
        this.base = base;
    }
    async insert(r: Reply): Promise<boolean> {
        if(!r.refId){
          return false;
        }
        const key = [this.base, this.KEY, r.id];
        const kv = await this.database.open();
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, r)
            .set([this.base, this.KEY2, r.refId, r.id], r)
            .commit();
        this.database.close();
        return res.ok;
    }
    async update(r: Reply): Promise<boolean> {
        if(!r.refId){
          return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic()
                .set([this.base, this.KEY, r.id], r)
                .set([this.base, this.KEY2, r.refId, r.id], r)
                .commit();
        this.database.close();
        return res.ok;
    }
    async delete(r: Reply): Promise<void> {
        if(!r.refId){
          return;
        }
        const kv = await this.database.open();
        await kv.atomic()
            .delete([this.base, this.KEY, r.id])
            .delete([this.base, this.KEY2, r.refId, r.id])
            .commit();
        this.database.close();
    }
    async read(id: string): Promise<Referral|undefined> {
        const kv = await this.database.open();
        const res = await kv.get<Reply>([this.base, this.KEY, id]);
        this.database.close();
        if(res && res.value){
            const appRepo = new AppointmentRepository(this.base);
            const app = await appRepo.read(res.value.refId);
            if(!app){
                return undefined;
            }
            const ref = toReferral(app);
            ref.replies = [res.value];
            return ref;
        }
        return undefined;
    }

    async list(cond: Condition): Promise<Referral[]> {
        const appRepo = new AppointmentRepository(this.base);
        const apps = await appRepo.list(cond);
        const refs = [];
        for(const app of apps){
            const ref = toReferral(app);
            refs.push(ref);
            const kv = await this.database.open();
            const res = kv.list<Reply>({prefix:[this.base, this.KEY2, ref.id]});
            for await (const r of res){
                ref.replies.push(r.value);
            }
            this.database.close();
        }
        return refs;
    }
}