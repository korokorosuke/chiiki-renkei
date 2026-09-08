import { type FetchResult, okWithData } from "../lib/response.ts";
import { type Appointment, type Condition, validate } from "./appointment.ts"
import { MainService, type IRepository, setId } from "./mainService.ts"

export interface IReferralRepository extends IRepository<Appointment>{
    list(cond: Condition): Promise<Appointment[]>
    listForReport(date: string, facilityId?: string, deptId?: string): Promise<Appointment[]>
}

export interface IAppointmentRepository extends IReferralRepository{}

export class AppointmentService extends MainService<Appointment, IAppointmentRepository>{
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

    async getListForReport(date: string, facilityId?: string, deptId?: string): Promise<Appointment[]>{
        return await this.getRepository().listForReport(date, facilityId, deptId);
    }

    override async insert(val: Appointment): Promise<FetchResult<Appointment>>{
        const res = await super.insert(val);
        if(res.ok){
            return okWithData(val);
        }
        return res;
    }

    override async update(val: Appointment): Promise<FetchResult<Appointment>>{
        const res = await super.update(val);
        if(res.ok){
            return okWithData(val);
        }
        return res;
    }
}