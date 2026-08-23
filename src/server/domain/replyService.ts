import { type Reply, type Condition, validate } from "./reply.ts"
import type { Referral } from "./referral.ts"
import { type Result, type FetchResult, ok, ng } from "../lib/response.ts"
import { generateId } from "./baseService.ts"
import { getNow } from "../lib/datetime.ts"


export interface IReplyRepository{
    insert(r: Reply): Promise<boolean>
    update(r: Reply): Promise<boolean>
    delete(r: Reply): Promise<boolean>
    read(id: string): Promise<Referral|undefined>
    list(cond: Condition): Promise<Referral[]>
}

export class ReplyListService{
    private i: IReplyRepository
    constructor(i: IReplyRepository){
        this.i = i;
    }

    async get(id: string): Promise<Referral|undefined>{
        return await this.i.read(id);
    }

    async getListByPatient(patientId: string): Promise<Referral[]>{
        return await this.i.list({patientId: patientId});
    }

    async getListByDate(fromDate: string, toDate: string): Promise<Referral[]>{
        return await this.i.list({fromDate: fromDate, toDate: toDate});
    }
}

export class ReplyService{
    private i: IReplyRepository
    constructor(i: IReplyRepository){
        this.i = i;
    }

    async insert(val: Reply): Promise<FetchResult<string>>{
        const res = validate(val);
        if(res.ok){
            val.id = generateId();
            val.updatedAt = getNow();
            if(await this.i.insert(val)){
                return ok(val.id);
            }else{
                return ng(["登録に失敗しました。"]);
            }
        }else{
            return ng(res.errors!);
        }
    }

    async update(val: Reply): Promise<Result>{
        const res = validate(val);
        if(res.ok){
            val.updatedAt = getNow();
            if(await this.i.update(val)){
                return ok();
            }else{
                return ng(["登録に失敗しました。"]);
            }
        }else{
            return ng(res.errors!);
        }
    }

    async delete(val: Reply): Promise<Result>{
        const res = await this.i.delete(val);
        if(res){
            return ok();
        }else{
            return ng(["削除に失敗しました。"]);
        }
    }
}