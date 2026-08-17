import { type Classification, validate } from "./classification.ts"
import { BaseService, type IRepository } from "./baseService.ts"

export interface IClassificationRepository extends IRepository<Classification>{
    all(): Promise<Classification[]>
}

export class ClassificationService extends BaseService<Classification, IClassificationRepository>{
    constructor(i: IClassificationRepository){
        super(i, validate);
    }

    async getAll(): Promise<Classification[]>{
        return await this.getRepository().all();
    }
}