import { type WebDepartment, validate } from "./webDepartment.ts"
import { BaseService, type IRepository } from "./baseService.ts"

export interface IWebDepartmentRepository extends IRepository<WebDepartment>{
    all(): Promise<WebDepartment[]>
}

export class WebDepartmentService extends BaseService<WebDepartment, IWebDepartmentRepository>{
    constructor(i: IWebDepartmentRepository){
        super(i, validate);
    }

    async getAll(): Promise<WebDepartment[]>{
        return await this.getRepository().all();
    }
}