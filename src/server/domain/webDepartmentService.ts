import { type WebDepartment, validate } from "./webDepartment.ts"
import { MainService, type IRepository } from "./mainService.ts"

export interface IWebDepartmentRepository extends IRepository<WebDepartment>{
    all(): Promise<WebDepartment[]>
}

export class WebDepartmentService extends MainService<WebDepartment, IWebDepartmentRepository>{
    constructor(i: IWebDepartmentRepository){
        super(i, validate);
    }

    async getAll(): Promise<WebDepartment[]>{
        return await this.getRepository().all();
    }
}