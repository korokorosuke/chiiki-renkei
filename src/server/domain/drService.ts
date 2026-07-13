import { type Dr, validate } from "./dr.ts"
import { BaseService, type IRepository } from "./baseService.ts"

export interface IDrRepository extends IRepository<Dr>{
    list(dept: string): Promise<Dr[]>
    all(): Promise<Dr[]>
}

export class DrService extends BaseService<Dr, IDrRepository>{
    constructor(i: IDrRepository){
        super(i, validate);
    }

    async getList(dept: string): Promise<Dr[]>{
        return await this.getRepository().list(dept);
    }

    async getAll(): Promise<Dr[]>{
        return await this.getRepository().all();
    }
}