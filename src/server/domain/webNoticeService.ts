import { type WebNotice, type NoticePage, validate } from "./webNotice.ts"
import { getTodayString } from "../../lib/datetime.ts"
import { MainService, type IRepository, setId } from "./mainService.ts"

export interface IWebNoticeRepository extends IRepository<WebNotice>{
    list(type: NoticePage, date: string): Promise<WebNotice[]>
    all(): Promise<WebNotice[]>
}

export class WebNoticeService extends MainService<WebNotice, IWebNoticeRepository>{
    constructor(i: IWebNoticeRepository){
        super(i, validate, setId);
    }

    async getList(page: NoticePage): Promise<WebNotice[]>{
        return await this.getRepository().list(page, getTodayString());
    }

    async getAll(): Promise<WebNotice[]>{
        return await this.getRepository().all();
    }
}