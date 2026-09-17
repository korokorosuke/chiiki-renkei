import { createServerFn } from "@tanstack/solid-start"
import { AddressService } from "../domain/addressService.ts"
import { AddressRepository } from "../infra/allRepository.ts"
import type { Address } from "../domain/address.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"

const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAddress = createServerFn({ method: "GET" })
  .validator((data : {postalCode: string}) => data)
  .handler(async ({ data }): Promise<Address|undefined> => {
    if(data && data.postalCode){
      const pcode = data.postalCode.includes("-") ? data.postalCode.replace("-", "") : data.postalCode;
      const service = new AddressService(new AddressRepository());
      return await service.get(pcode);
    }
    return undefined;
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
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
  .middleware([LoggingMiddleware])
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
  .middleware([LoggingMiddleware])
  .validator((data: {address: Address}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new AddressService(new AddressRepository());
      return await service.delete(data.address);
    }else{
      return ng(auth.errors!);
    }
});