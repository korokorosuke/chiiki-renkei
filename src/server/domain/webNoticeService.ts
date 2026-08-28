import { type WebNotice, type NOTICE_PAGE, validate } from "./webNotice.ts"
import { getTodayString } from "../../lib/datetime.ts"
import { BaseService, type IRepository, setId } from "./baseService.ts"

export interface IWebNoticeRepository extends IRepository<WebNotice>{
    list(type: NOTICE_PAGE, date: string): Promise<WebNotice[]>
    all(): Promise<WebNotice[]>
}

export class WebNoticeService extends BaseService<WebNotice, IWebNoticeRepository>{
    constructor(i: IWebNoticeRepository){
        super(i, validate, setId);
    }

    async getList(page: NOTICE_PAGE): Promise<WebNotice[]>{
        return await this.getRepository().list(page, getTodayString());
    }

    async getAll(): Promise<WebNotice[]>{
        return await this.getRepository().all();
    }
}