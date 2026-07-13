import { type Due, validate } from "./due.ts"
import { BaseWriteService, type IWriteRepository } from "./baseService.ts"

export interface IDueRepository extends IWriteRepository<Due>{
    read(id: number): Promise<Due|undefined>
    all(): Promise<Due[]>
}

export class DueService extends BaseWriteService<Due, IDueRepository>{
    constructor(i: IDueRepository){
        super(i, validate);
    }

    async get(id: number): Promise<Due|undefined>{
        return await this.getRepository().read(id);
    }

    async getAll(): Promise<Due[]>{
        return await this.getRepository().all();
    }
}