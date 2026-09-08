import { type Activity, type Condition, validate } from "./activity.ts"
import { MainService, type IRepository, setId } from "./mainService.ts"

export interface IActivityRepository extends IRepository<Activity>{
    list(cond: Condition): Promise<Activity[]>
}

export class ActivityService extends MainService<Activity, IActivityRepository>{
    constructor(i: IActivityRepository){
        super(i, validate, setId);
    }

    async getList(props: {facilityId?:string,
            fromDate?: string, toDate?: string}): Promise<Activity[]>{
        return await this.getRepository().list(props);
    }
}