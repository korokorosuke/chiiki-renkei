import { type Activity, type Condition, validate } from "./activity.ts"
import { BaseService, type IRepository, setId } from "./baseService.ts"

export interface IActivityRepository extends IRepository<Activity>{
    list(cond: Condition): Promise<Activity[]>
}

export class ActivityService extends BaseService<Activity, IActivityRepository>{
    constructor(i: IActivityRepository){
        super(i, validate, setId);
    }

    async getList(props: {facilityId?:string,
            fromDate?: string, toDate?: string}): Promise<Activity[]>{
        return await this.getRepository().list(props);
    }
}