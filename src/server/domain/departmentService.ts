import { type Department, validate } from "./department.ts"
import { BaseService, type IRepository } from "./baseService.ts"

export interface IDepartmentRepository extends IRepository<Department>{
    all(): Promise<Department[]>
    exam(): Promise<Department[]>
}

export class DepartmentService extends BaseService<Department, IDepartmentRepository>{
    constructor(i: IDepartmentRepository){
        super(i, validate);
    }

    async getExam(): Promise<Department[]>{
        return await this.getRepository().exam();
    }

    async getAll(): Promise<Department[]>{
        return await this.getRepository().all();
    }
}