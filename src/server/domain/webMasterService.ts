import { type WebMaster, validate } from "./webMaster.ts"
import { MainWriteService, type IWriteRepository } from "./mainService.ts"

export interface IWebMasterRepository extends IWriteRepository<WebMaster>{
    read(dept: string, dr: string, week: number): Promise<WebMaster|undefined>
}

export class WebMasterService extends MainWriteService<WebMaster, IWebMasterRepository>{
    constructor(i: IWebMasterRepository){
        super(i, validate);
    }

    async get(dept: string, dr: string, week: number): Promise<WebMaster|undefined>{
        return await super.getRepository().read(dept, dr, week);
    }
}