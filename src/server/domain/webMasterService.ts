import { type WebMaster, validate } from "./webMaster.ts"
import { BaseWriteService, type IWriteRepository } from "./baseService.ts"

export interface IWebMasterRepository extends IWriteRepository<WebMaster>{
    read(dept: string, dr: string, week: number): Promise<WebMaster|undefined>
}

export class WebMasterService extends BaseWriteService<WebMaster, IWebMasterRepository>{
    constructor(i: IWebMasterRepository){
        super(i, validate);
    }

    async get(dept: string, dr: string, week: number): Promise<WebMaster|undefined>{
        return await super.getRepository().read(dept, dr, week);
    }
}