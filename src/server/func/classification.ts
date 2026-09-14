import { createServerFn } from "@tanstack/solid-start"
import { ClassificationService } from "../domain/classificationService.ts"
import { ClassificationRepository } from "../infra/allRepository.ts"
import type { Classification } from "../domain/classification.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { info } from "./log.ts"

const AUTH_READ_ALL = [
  {auth: Auth.MASTER, role: Role.READ},
  {auth: Auth.REFERRAL, role: Role.WRITE}
];
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getAllClassifications = createServerFn({ method: "GET" })
  .handler(async (): Promise<Classification[]> => {
    const auth = await authenticate(AUTH_READ_ALL);
    if(auth.ok){
      const service = new ClassificationService(new ClassificationRepository(auth.user.base));
      return await service.getAll();
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .validator((data : {Classification: Classification}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ClassificationService(new ClassificationRepository(auth.user.base));
      const res = await service.insert(data.Classification);
      if(res.ok){
        info({ data: { title: "insert Classification", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data : {Classification: Classification}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ClassificationService(new ClassificationRepository(auth.user.base));
      const res = await service.update(data.Classification);
      if(res.ok){
        info({ data: { title: "update Classification", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data : {Classification: Classification}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ClassificationService(new ClassificationRepository(auth.user.base));
      const res = await service.delete(data.Classification);
      if(res.ok){
        info({ data: { title: "delete Classification", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});