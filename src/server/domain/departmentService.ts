import { type Department, validate } from "./department.ts"
import { MainService, type IRepository } from "./mainService.ts"

export interface IDepartmentRepository extends IRepository<Department>{
    all(): Promise<Department[]>
    exam(): Promise<Department[]>
}

export class DepartmentService extends MainService<Department, IDepartmentRepository>{
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