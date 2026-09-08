import { type Answer, type AnswerPassword, validate, validatePassword, MAX_CHECK_COUNT } from "./answer.ts"
import { MainService, type IRepository, setId } from "./mainService.ts"
import { Crypto } from "../../lib/crypto.ts"
import { type Result, type FetchResult, ok, ng } from "../lib/response.ts"

export interface IAnswerRepository extends IRepository<Answer>{
    list(appId: string): Promise<Answer[]>
    listByPatient(patientId: string): Promise<Answer[]>
    base: string
}

export interface IAnswerPasswordRepository extends IRepository<AnswerPassword>{
    countUp(appId: string): Promise<boolean>
}

export class AnswerService extends MainService<Answer, IAnswerRepository>{
    private passService: AnswerPasswordService
    constructor(i: IAnswerRepository, repo: IAnswerPasswordRepository){
        super(i, validate, setId);
        this.passService = new AnswerPasswordService(repo);
    }

    async getList(appId: string): Promise<Answer[]>{
        return await this.getRepository().list(appId);
    }

    async getListByPatient(patientId: string): Promise<Answer[]>{
        return await this.getRepository().listByPatient(patientId);
    }

    getPasswordService(): AnswerPasswordService{
        return this.passService;
    }

    override async update(val: Answer): Promise<Result>{
        val.inputDate = new Date().toISOString();
        const res = await super.update(val);
        if(res.ok){
            return ok();
        }
        return res;
    }
}

export class AnswerPasswordService extends MainService<AnswerPassword, IAnswerPasswordRepository>{
    constructor(i: IAnswerPasswordRepository){
        super(i, validatePassword);
    }

    async create(appId: string): Promise<AnswerPassword>{
        const ap: AnswerPassword = {
            appointmentId: appId,
            password: await this.generatePassword(appId),
            failCount: 0,
        }
        return ap;
    }

    async generatePassword(appId: string): Promise<string>{
        const password = await Crypto.sha1(Crypto.encode(appId + Math.random().toString()));
        return new Uint8Array(password).toHex().slice(0, 8);
    }

    async getPassword(appId: string): Promise<string>{
        const ap = await this.getRepository().read(appId);
        if(ap){
            return ap.password;
        }
        return "";
    }

    async resetPassword(appId: string): Promise<FetchResult<string>>{
        const ap = await this.create(appId);
        const res = await this.update(ap);
        if(res.ok){
            return {
                ...res,
                data: ap.password
            };
        }
        return res;
    }

    async countUp(appId: string): Promise<Result>{
        const res = await this.getRepository().countUp(appId);
        if(res){
            return ok();
        }else{
            return ng(["更新に失敗しました。"]);
        }
    }

    async checkPassword(appId: string, password: string): Promise<Result>{
        const ap = await this.getRepository().read(appId);
        if(ap){
            if(ap.failCount >= MAX_CHECK_COUNT){
                return ng(["パスワードの試行回数が上限に達しました。"]);
            }
            if(ap.password === password){
                return ok();
            }else{
                await this.getRepository().countUp(appId);
                return ng(["パスワードが違います。"]);
            }
        }
        return ng(["不正なデータです。"]);
    }
}