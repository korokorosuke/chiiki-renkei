import { type Staff, type Condition, validate } from "./staff.ts"
import { MainService, type IRepository, setId } from "./mainService.ts"

export interface IStaffRepository extends IRepository<Staff>{
    list(cond: Condition): Promise<Staff[]>
}

export class StaffService extends MainService<Staff, IStaffRepository>{
    constructor(i: IStaffRepository){
        super(i, validate, setId);
    }

    async getAll(facilityId: string): Promise<Staff[]>{
        return await this.getRepository().list({facilityid: facilityId, dr: false, hidden: true});
    }

    async getDr(facilityId: string): Promise<Staff[]>{
        return await this.getRepository().list({facilityid: facilityId, dr: true, hidden: false});
    }

    async getList(facilityId: string): Promise<Staff[]>{
        return await this.getRepository().list({facilityid: facilityId, dr: false, hidden: false});
    }
}