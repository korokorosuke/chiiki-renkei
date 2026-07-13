import { type Address, validate } from "./address.ts"
import { BaseService, type IRepository } from "./baseService.ts"

export interface IAddressRepository extends IRepository<Address>{ }

export class AddressService extends BaseService<Address, IAddressRepository>{
    constructor(i: IAddressRepository){
        super(i, validate);
    }
}