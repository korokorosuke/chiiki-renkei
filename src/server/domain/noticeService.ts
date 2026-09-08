import { type Notice, type NOTICE_PAGE, validate } from "./notice.ts"
import { getTodayString } from "../../lib/datetime.ts"
import { MainService, type IRepository, setId } from "./mainService.ts"

export interface INoticeRepository extends IRepository<Notice>{
    list(type: NOTICE_PAGE, date: string): Promise<Notice[]>
    all(): Promise<Notice[]>
}

export class NoticeService extends MainService<Notice, INoticeRepository>{
    constructor(i: INoticeRepository){
        super(i, validate, setId);
    }

    async getList(page: NOTICE_PAGE): Promise<Notice[]>{
        return await this.getRepository().list(page, getTodayString());
    }

    async getAll(): Promise<Notice[]>{
        return await this.getRepository().all();
    }
}