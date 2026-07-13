import { type Staff, type Condition, validate } from "./staff.ts"
import { BaseService, type IRepository, setId } from "./baseService.ts"

export interface IStaffRepository extends IRepository<Staff>{
    list(cond: Condition): Promise<Staff[]>
}

export class StaffService extends BaseService<Staff, IStaffRepository>{
    constructor(i: IStaffRepository){
        super(i, validate, setId);
    }

    sort(ss: Staff[]){
        return ss.sort((s1, s2)=>{
            if(s1.sort > s2.sort){
                return 1;
            }else if(s1.sort < s2.sort){
                return -1;
            }else{
                return 0;
            }
        });
    }

    async getAll(facilityId: string): Promise<Staff[]>{
        const ss = await this.getRepository().list({facilityid: facilityId, dr: false, hidden: true});
        return this.sort(ss);
    }

    async getDr(facilityId: string): Promise<Staff[]>{
        const ss = await this.getRepository().list({facilityid: facilityId, dr: true, hidden: false});
        return this.sort(ss);
    }

    async getList(facilityId: string): Promise<Staff[]>{
        const ss = await this.getRepository().list({facilityid: facilityId, dr: false, hidden: false});
        return this.sort(ss);
    }
}