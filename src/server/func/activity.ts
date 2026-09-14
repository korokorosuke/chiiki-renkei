import { createServerFn } from "@tanstack/solid-start"
import { ActivityService } from "../domain/activityService.ts"
import { ActivityRepository } from "../infra/allRepository.ts"
import type { Activity } from "../domain/activity.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import { type Result, ng } from "../lib/response.ts"
import { info } from "./log.ts"

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
  .validator((data: { activity: Activity }) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
        const service = new ActivityService(new ActivityRepository(auth.user.base));
        const res = await service.insert(data.activity);
        if(res.ok){
          info({ data: { title: "insert Activity", details: JSON.stringify(data) } });
        }
        return res;
    }
    return ng(auth.errors!);
});

export const update = createServerFn({ method: "POST" })
  .validator((data: { activity: Activity }) => data)
  .handler(async ({ data }): Promise<Result> => {

    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ActivityService(new ActivityRepository(auth.user.base));
      const res = await service.update(data.activity);
      if(res.ok){
        info({ data: { title: "upate Activity", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});

export const del = createServerFn({ method: "POST" })
  .validator((data: { activity: Activity }) => data)
  .handler(async ({ data }): Promise<Result> => {
    const auth = await authenticate(AUTH_WRITE);
    if(auth.ok){
      const service = new ActivityService(new ActivityRepository(auth.user.base));
      const res = await service.delete(data.activity);
      if(res.ok){
        info({ data: { title: "delete Activity", details: JSON.stringify(data) } });
      }
      return res;
    }
    return ng(auth.errors!);
});