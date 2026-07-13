import { type FetchResult, ok } from "../lib/response.ts";
import { type Appointment, type Condition, validate } from "./appointment.ts"
import { BaseService, type IRepository, setId } from "./baseService.ts"

export interface IReferralRepository extends IRepository<Appointment>{
    list(cond: Condition): Promise<Appointment[]>
}

export interface IAppointmentRepository extends IReferralRepository{}

export class AppointmentService extends BaseService<Appointment, IAppointmentRepository>{
    constructor(i: IAppointmentRepository){
        super(i, validate, (val)=>{
            if(!val.id){
                setId(val);
            }
        });
    }

    async getListByPatient(patientId: string): Promise<Appointment[]>{
        return await this.getRepository().list({patientId: patientId});
    }

    async getListByDate(fromDate: string, toDate: string): Promise<Appointment[]>{
        return await this.getRepository().list({fromDate: fromDate, toDate: toDate});
    }

    override async insert(val: Appointment): Promise<FetchResult<Appointment>>{
        const res = await super.insert(val);
        if(res.ok){
            return ok(val);
        }
        return res;
    }

    override async update(val: Appointment): Promise<FetchResult<Appointment>>{
        const res = await super.update(val);
        if(res.ok){
            return ok(val);
        }
        return res;
    }
}