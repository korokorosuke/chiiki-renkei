import { createServerFn } from "@tanstack/solid-start"
import { AddressService } from "../domain/addressService.ts"
import { AddressRepository } from "../infra/allRepository.ts"
import type { Address } from "../domain/address.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ok, ng } from "../lib/response.ts"

const AUTH_READ = [
  {auth: Auth.FACILITY, role: Role.READ},
  {auth: Auth.MASTER, role: Role.READ},
];
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAddress = createServerFn({ method: "GET" })
  .validator((data : {postalCode: string}) => data)
  .handler(async ({ data }): Promise<Address|undefined> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data && data.postalCode){
        const service = new AddressService(new AddressRepository());
        return await service.get(data.postalCode);
      }
    }
    return undefined;
});

export const insert = createServerFn({ method: "POST" })
  .validator((data: {address: Address}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new AddressService(new AddressRepository());
      return await service.insert(data.address);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data: {address: Address}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new AddressService(new AddressRepository());
      return await service.update(data.address);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data: {address: Address}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      if(data){
        const service = new AddressService(new AddressRepository());
        await service.delete(data.address);
        return ok();
      }else{
        return ng(["データが不正です。"]);
      }
    }else{
      return auth;
    }
});