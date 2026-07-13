import { type Notice, validate } from "./notice.ts"
import { getTodayString } from "../../lib/datetime.ts"
import { BaseService, type IRepository, setId } from "./baseService.ts"

export interface INoticeRepository extends IRepository<Notice>{
    list(date?: string): Promise<Notice[]>
}

export class NoticeService extends BaseService<Notice, INoticeRepository>{
    constructor(i: INoticeRepository){
        super(i, validate, setId);
    }

    async getList(): Promise<Notice[]>{
        return await this.getRepository().list(getTodayString());
    }

    async getAll(): Promise<Notice[]>{
        return await this.getRepository().list();
    }
}