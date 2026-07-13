import { type Patient, type Condition, validate } from "./patient.ts"
import { type Result } from "../lib/response.ts"
import { toNumberCode } from "./address.ts"
import { BaseService, type IRepository } from "./baseService.ts"

export interface IPatientRepository extends IRepository<Patient>{
    list(cond: Condition): Promise<Patient[]>
}

export class PatientService extends BaseService<Patient, IPatientRepository>{
    constructor(i: IPatientRepository){
        super(i, validate);
    }

    async getList(name: string): Promise<Patient[]>{
        return await this.getRepository().list({name: name});
    }

    override async insert(val: Patient): Promise<Result>{
        if(val.address.postalCode){
            val.address.postalCode = toNumberCode(val.address.postalCode);
        }
        return await super.insert(val);
    }

    override async update(val: Patient): Promise<Result>{
        if(val.address.postalCode){
            val.address.postalCode = toNumberCode(val.address.postalCode);
        }
        return await super.update(val);
    }
}