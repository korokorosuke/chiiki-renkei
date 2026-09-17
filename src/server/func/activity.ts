import { createServerFn } from "@tanstack/solid-start"
import { ActivityService } from "../domain/activityService.ts"
import { ActivityRepository } from "../infra/allRepository.ts"
import type { Activity } from "../domain/activity.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { LoggingMiddleware } from "../middleware/logging.ts"

const AUTH_READ = [
  {auth: Auth.APPOINT, role: Role.READ},
];
const AUTH_WRITE = {auth: Auth.MASTER, role: Role.WRITE};

export const getActivities = createServerFn({ method: "GET" })
  .validator((data: {facilityId?: string, fromDate?: string, toDate?: string}) => data)
  .handler(async({ data }): Promise<Activity[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      if(data.facilityId || data.fromDate || data.toDate){
        const service = new ActivityService(new ActivityRepository(auth.user.base));
        return await service.getList(data);
      }
    }
    return [];
});

export const insert = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data: { activity: Activity }) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
        const service = new ActivityService(new ActivityRepository(auth.user.base));
        return await service.insert(data.activity);
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data: { activity: Activity }) => data)
  .handler(async ({ data }): Promise<Result> => {

    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ActivityService(new ActivityRepository(auth.user.base));
      return await service.update(data.activity);
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .middleware([LoggingMiddleware])
  .validator((data: { activity: Activity }) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ActivityService(new ActivityRepository(auth.user.base));
      return await service.delete(data.activity);
    }
    return ng(auth.errors!);
});