import { type Inquiry, type Condition, validate } from "./inquiry.ts"
import { MainService, type IRepository, setId } from "./mainService.ts"

export interface IInquiryRepository extends IRepository<Inquiry>{
    list(cond: Condition): Promise<Inquiry[]>
}

export class InquiryService extends MainService<Inquiry, IInquiryRepository>{
    constructor(i: IInquiryRepository){
        super(i, validate, setId);
    }

    async getList(props: {patientId?:string, facilityId?:string,
            fromDate?: string, toDate?: string}): Promise<Inquiry[]>{
        return await this.getRepository().list(props);
    }

    async getListByPatient(id: string): Promise<Inquiry[]>{
        return await this.getRepository().list({patientId: id});
    }

    async getListByFacility(id: string): Promise<Inquiry[]>{
        return await this.getRepository().list({facilityId: id});
    }

    async getListByDate(fromDate: string, toDate: string): Promise<Inquiry[]>{
        return await this.getRepository().list({fromDate: fromDate, toDate: toDate});
    }
}