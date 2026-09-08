import { type Classification, validate } from "./classification.ts"
import { MainService, type IRepository } from "./mainService.ts"

export interface IClassificationRepository extends IRepository<Classification>{
    all(): Promise<Classification[]>
}

export class ClassificationService extends MainService<Classification, IClassificationRepository>{
    constructor(i: IClassificationRepository){
        super(i, validate);
    }

    async getAll(): Promise<Classification[]>{
        return await this.getRepository().all();
    }
}