import { type ReferralTo, type Condition, validate } from "./referralto.ts"
import { BaseService, type IRepository, setId } from "./baseService.ts"

export interface IReferralToRepository extends IRepository<ReferralTo>{
    list(cond: Condition): Promise<ReferralTo[]>
}

export class ReferralToService extends BaseService<ReferralTo, IReferralToRepository>{
    constructor(i: IReferralToRepository){
        super(i, validate, setId);
    }

    async getListByPatient(patientId: string): Promise<ReferralTo[]>{
        return await this.getRepository().list({patientId: patientId});
    }

    async getListByDate(fromDate: string, toDate: string): Promise<ReferralTo[]>{
        return await this.getRepository().list({fromDate: fromDate, toDate: toDate});
    }
}