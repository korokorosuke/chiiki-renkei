import { type WebAppointment, type Condition, validate } from "./webAppointment.ts"
import { toNumberCode } from "./address.ts"
import { type Result, type FetchResult, ok, ng } from "../lib/response.ts"
import { getNow, generateId } from "./baseService.ts"

export interface IWebAppRepository{
    insert(r: WebAppointment): Promise<boolean>
    update(r: WebAppointment): Promise<boolean>
    delete(r: WebAppointment): Promise<void>
    read(id: string): Promise<WebAppointment|undefined>
    list(cond: Condition): Promise<WebAppointment[]>
}

export const ID_EMPTY = "ID_EMPTY";
export const DATE_EMPTY = "1900-01-01";

export class WebAppService{
    private i: IWebAppRepository

    constructor(i: IWebAppRepository){
        this.i = i;
    }

    convertToEmpty(val: WebAppointment): WebAppointment{
        if(!val.patient.id){
            val.patient.id = ID_EMPTY;
        }
        if(!val.date){
            val.date = DATE_EMPTY;
        }
        return val;
    }

    convertEmpty(val: WebAppointment): WebAppointment{
        if(val.patient.id === ID_EMPTY){
            val.patient.id = "";
        }
        if(val.date === DATE_EMPTY){
            val.date = "";
        }
        return val;
    }

    async getRaw(id: string): Promise<WebAppointment|undefined>{
        return await this.i.read(id);
    }

    async get(id: string): Promise<WebAppointment|undefined>{
        const x = await this.i.read(id);
        if(x){
            return this.convertEmpty(x);;
        }else{
            return x;
        }
    }

    async getList(props: {patientId?:string, facilityId?:string,
            fromDate?: string, toDate?: string}): Promise<WebAppointment[]>{
        const list = await this.i.list(props);
        for(const app of list){
            if(app){
                this.convertEmpty(app);
            }
        }
        return list;
    }

    async getByFacPatientId(facId: string, facPatientId: string): Promise<WebAppointment|undefined>{
        const list = await this.i.list({facilityId: facId});
        const apps = list.filter(app=>app.facPatientId === facPatientId);
        apps.sort((a, b) => b.id.localeCompare(a.id));
        for(const app of apps){
            if(app){
                return this.convertEmpty(app);
            }
        }
        return undefined;
    }

    async getNoID(): Promise<WebAppointment[]>{
        const list = await this.i.list({patientId: ID_EMPTY});
        for(const app of list){
            if(app){
                this.convertEmpty(app);
            }
        }
        return list;
    }

    async getConsultation(facId?: string|undefined): Promise<WebAppointment[]>{
        const list = await this.i.list({fromDate: DATE_EMPTY, toDate: DATE_EMPTY});
        for(const app of list){
            if(app){
                this.convertEmpty(app);
            }
        }
        if(facId){
            return list.filter(a => a.facility.id === facId);
        }else{
            return list;
        }
    }

    async insert(val: WebAppointment): Promise<FetchResult<WebAppointment>>{
        const vres = validate(val);
        if(!vres.ok){
            return ng(vres.errors!);
        }

        const now = getNow();
        val.createdAt = now;
        val.updatedAt = now;
        val.id = generateId();
        val.patient.address.postalCode = toNumberCode(val.patient.address.postalCode);
        val = this.convertToEmpty(val);
        const res = await this.i.insert(val);
        if(res){
            return ok<WebAppointment>(val);
        }else{
            return ng(["登録に失敗しました。"]);
        }
    }

    async update(val: WebAppointment): Promise<FetchResult<WebAppointment>>{
        const vres = validate(val);
        if(!vres.ok){
            return ng(vres.errors!);
        }

        val.updatedAt = getNow();
        val.patient.address.postalCode = toNumberCode(val.patient.address.postalCode);
        val = this.convertToEmpty(val);
        const res = await this.i.update(val);
        if(res){
            return ok<WebAppointment>(val);
        }else{
            return ng(["登録に失敗しました。"]);
        }
    }

    async delete(val: WebAppointment): Promise<void>{
        await this.i.delete(val);
    }

    async cancel(val: WebAppointment): Promise<Result>{
        val.updatedAt = getNow();
        val.cancel = true;
        val = this.convertToEmpty(val);
        const res = await this.i.update(val);
        if(res){
            return ok();
        }
        return ng(["キャンセルに失敗しました。"]);
    }
}