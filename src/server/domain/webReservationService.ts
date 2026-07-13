import { type WebReservation, validate } from "./webReservation.ts"
import { BaseWriteService, type IWriteRepository } from "./baseService.ts"

export interface IWebReservationRepository extends IWriteRepository<WebReservation>{
    read(dept: string, dr: string, date: string, time: string): Promise<WebReservation|undefined>
    list(dept: string, dr: string, yyyymm: string): Promise<WebReservation[]>
    listByDate(dept: string, yyyymm: string): Promise<WebReservation[]>
}

export class WebReservationService extends BaseWriteService<WebReservation, IWebReservationRepository>{
    constructor(i: IWebReservationRepository){
        super(i, validate);
    }

    async get(dept: string, dr: string, date: string, time: string): Promise<WebReservation|undefined>{
        return await super.getRepository().read(dept, dr, date, time);
    }

    async getList(dept: string, dr: string, yyyymm: string): Promise<WebReservation[]>{
        return await super.getRepository().list(dept, dr, yyyymm);
    }

    async getListByDate(dept: string, yyyymm: string): Promise<WebReservation[]>{
        return await super.getRepository().listByDate(dept, yyyymm);
    }
}