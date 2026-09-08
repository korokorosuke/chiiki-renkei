import type { AuthUser, User, Condition } from "./user.ts"
import { validate } from "./user.ts"
import { Crypto } from "../../lib/crypto.ts"
import * as base64 from "../../lib/base64.ts"
import { type Result, ok, ng } from "../lib/response.ts"
import { MainService, type IRepository } from "./mainService.ts"

export interface IUserRepository extends IRepository<AuthUser>{
    list(c: Condition): Promise<AuthUser[]>
}

export class UserService extends MainService<AuthUser, IUserRepository>{
    constructor(i: IUserRepository){
        super(i, validate);
    }

    async getUser(id: string): Promise<User|undefined>{
        const user = await this.getRepository().read(id);
        if(user){
            return {id: user.id, name: user.name, department: user.department};
        }else{
            return undefined;
        }
    }

    async getPassword(id: string): Promise<string> {
        const user = await this.get(id);
        if(user && user.password){
            return user.password;
        }
        return "";
    }

    async getList(name: string): Promise<AuthUser[]>{
        return await this.getRepository().list({name: name});
    }

    override async insert(val: AuthUser): Promise<Result>{
        const res = validate(val);
        if(res.ok){
            if(val.password){
                val.password = base64.encode(new Uint8Array(await Crypto.sha256(Crypto.encode(val.password))));
            }
            if(await this.getRepository().insert(val)){
                return ok();
            }else{
                return ng(["登録に失敗しました。"]);
            }
        }else{
            return res;
        }
    }

    override async update(val: AuthUser): Promise<Result>{
        const res = validate(val);
        if(res.ok){
            const password = await this.getPassword(val.id);
            if(val.password && password != val.password){
                val.password = base64.encode(new Uint8Array(await Crypto.sha256(Crypto.encode(val.password))));
            }
            if(await this.getRepository().update(val)){
                return ok();
            }else{
                return ng(["登録に失敗しました。"]);
            }
        }else{
            return res;
        }
    }
}