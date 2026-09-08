import { type Address, validate } from "./address.ts"
import { MainService, type IRepository } from "./mainService.ts"

export interface IAddressRepository extends IRepository<Address>{ }

export class AddressService extends MainService<Address, IAddressRepository>{
    constructor(i: IAddressRepository){
        super(i, validate);
    }
}