import { type WebNotice, validate } from "./webNotice.ts"
import { getTodayString } from "../../lib/datetime.ts"
import { BaseService, type IRepository, setId } from "./baseService.ts"

export interface IWebNoticeRepository extends IRepository<WebNotice>{
    list(date?: string): Promise<WebNotice[]>
}

export class WebNoticeService extends BaseService<WebNotice, IWebNoticeRepository>{
    constructor(i: IWebNoticeRepository){
        super(i, validate, setId);
    }

    async getList(): Promise<WebNotice[]>{
        return await this.getRepository().list(getTodayString());
    }

    async getAll(): Promise<WebNotice[]>{
        return await this.getRepository().list();
    }
}