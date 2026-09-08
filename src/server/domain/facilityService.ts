import { type Facility, type Condition, validate } from "./facility.ts"
import { toNumberCode } from "./address.ts"
import { type Result } from "../lib/response.ts"
import { MainService, type IRepository } from "./mainService.ts"

export interface IFacilityRepository extends IRepository<Facility>{
    list(name: string): Promise<Facility[]>
}

export class FacilityService extends MainService<Facility, IFacilityRepository>{
    constructor(i: IFacilityRepository){
        super(i, validate);
    }

    async getList(cond: Condition): Promise<Facility[]>{
        return await this.getRepository().list(cond.name);
    }

    override async insert(val: Facility): Promise<Result>{
        if(val.address.postalCode){
            val.address.postalCode = toNumberCode(val.address.postalCode);
        }
        return await super.insert(val);
    }

    override async update(val: Facility): Promise<Result>{
        if(val.address.postalCode){
            val.address.postalCode = toNumberCode(val.address.postalCode);
        }
        return await super.update(val);
    }
}