import { type ReferralTo, type Condition, validate } from "./referralto.ts"
import { MainService, type IRepository, setId } from "./mainService.ts"

export interface IReferralToRepository extends IRepository<ReferralTo>{
    list(cond: Condition): Promise<ReferralTo[]>
}

export class ReferralToService extends MainService<ReferralTo, IReferralToRepository>{
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