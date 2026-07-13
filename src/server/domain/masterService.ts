import { type Master, validate } from "./master.ts"
import { type Result, ok, ng } from "../lib/response.ts"

export interface IMasterRepository{
    update(key: string, value: string[]): Promise<boolean>
    read(key: string): Promise<string[]|undefined>
}

export class MasterService{
    private i: IMasterRepository
    constructor(i: IMasterRepository){
        this.i = i;
    }

    async get(id: string): Promise<string[]|undefined>{
        return await this.i.read(id);
    }

    async update(val: Master): Promise<Result>{
        const res = validate(val);
        if(res.ok){
            if(await this.i.update(val.id, val.value)){
                return ok();
            }else{
                return ng(["登録に失敗しました。"]);
            }
        }else{
            return res;
        }
    }
}