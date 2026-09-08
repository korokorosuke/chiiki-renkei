import { type WebDr, validate } from "./webDr.ts"
import { MainService, type IRepository } from "./mainService.ts"

export interface IWebDrRepository extends IRepository<WebDr>{
    list(dept: string): Promise<WebDr[]>
    all(): Promise<WebDr[]>
}

export class WebDrService extends MainService<WebDr, IWebDrRepository>{
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