/// <reference lib="deno.unstable" />
import type { Reply, Condition } from "../domain/reply.ts"
import type { Referral } from "../domain/referral.ts"
import type { IReplyRepository } from "../domain/replyService.ts"
import { toReferral } from "../lib/types.ts"
import { AppointmentRepository } from "./appointmentRepository.ts"
import { Kv } from "./kv.ts"
import { fatal } from "../lib/log.ts"

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
            await fatal(`${this.constructor.name} insert`, "refIdが指定されていません", this.base);
            return false;
        }
        const key = [this.base, this.KEY, r.id];
        const kv = await this.database.open();
        const res = await kv.atomic().check({key, versionstamp: null})
            .set(key, r)
            .set([this.base, this.KEY2, r.refId, r.id], r)
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} insert`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async update(r: Reply): Promise<boolean> {
        if(!r.refId){
            await fatal(`${this.constructor.name} update`, "refIdが指定されていません", this.base);
            return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic()
                .set([this.base, this.KEY, r.id], r)
                .set([this.base, this.KEY2, r.refId, r.id], r)
                .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} update`, "失敗しました", this.base);
        }
        return res.ok;
    }
    async delete(r: Reply): Promise<boolean> {
        if(!r.refId){
            await fatal(`${this.constructor.name} delete`, "refIdが指定されていません", this.base);
            return false;
        }
        const kv = await this.database.open();
        const res = await kv.atomic()
            .delete([this.base, this.KEY, r.id])
            .delete([this.base, this.KEY2, r.refId, r.id])
            .commit();
        this.database.close();
        if(!res.ok){
            await fatal(`${this.constructor.name} delete`, "失敗しました", this.base);
        }
        return res.ok;
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