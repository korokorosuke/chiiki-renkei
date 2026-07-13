import { type WebDr, validate } from "./webDr.ts"
import { BaseService, type IRepository } from "./baseService.ts"

export interface IWebDrRepository extends IRepository<WebDr>{
    list(dept: string): Promise<WebDr[]>
    all(): Promise<WebDr[]>
}

export class WebDrService extends BaseService<WebDr, IWebDrRepository>{
    constructor(i: IWebDrRepository){
        super(i, validate);
    }

    async getList(dept: string): Promise<WebDr[]>{
        return await this.getRepository().list(dept);
    }

    async getAll(): Promise<WebDr[]>{
        return await this.getRepository().all();
    }
}