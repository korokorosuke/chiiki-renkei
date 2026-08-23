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
  delete(_: Address): Promise<boolean> {
    return Promise.reject(new Error("Not implemented"));
  }
  async read(postalCode: string): Promise<Address|undefined> {
    try{
      let url = Deno.env.get(ADDRESS_URL);
      if(!url){
        return Promise.reject(new Error("No env parameter"));
      }
      if(url.endsWith("=") || url.endsWith("/")){
        url = `${url}${postalCode}`;
      }else{
        url = `${url}/${postalCode}`;
      }
      const res = await fetch(url);
      if(res.ok){
        return await res.json() as Address;
      }
    }catch(e){
      return Promise.reject(e);
    }
    return undefined;
  }
}