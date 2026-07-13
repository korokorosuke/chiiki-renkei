import type { Address } from "../../domain/address.ts"
import type { IAddressRepository } from "../../domain/addressService.ts"
import { ADDRESS_URL } from "../../settings.ts"

export class AddressRepository implements IAddressRepository {
  constructor(){
  }
  insert(_: Address): Promise<boolean> {
    return Promise.reject(new Error("Not implemented"));
  }
  update(_: Address): Promise<boolean> {
    return Promise.reject(new Error("Not implemented"));
  }
  delete(_: Address): Promise<void> {
    return Promise.reject(new Error("Not implemented"));
  }
  async read(postalCode: string): Promise<Address|undefined> {
    try{
      let url = Deno.env.get(ADDRESS_URL);
      if(!url){
        return Promise.reject(new Error("No env parameter"));
      }
      if(url.endsWith("/")){
        url = url.substring(0, url.length - 1);
      }
      const res = await fetch(`${url}/${postalCode}`);
      if(res.ok){
        return await res.json() as Address;
      }
    }catch(e){
      return Promise.reject(e);
    }
    return undefined;
  }
}