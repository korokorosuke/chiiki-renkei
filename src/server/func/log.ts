import { createServerFn } from "@tanstack/solid-start"
import { LogListService } from "../domain/logListService.ts"
import { LogRepository } from "../infra/allRepository.ts"
import { authenticate, Auth, Role } from "../lib/auth.ts"
import type { Log, LogLevel } from "../domain/log.ts"
import { type Result, ok, ng } from "../lib/response.ts"
import { checkAndWrite, writeLogWithBase as writeLog, checkLevel } from "../lib/log.ts"

const AUTH_READ = {auth: Auth.LOG, role: Role.READ};

export const fatal = createServerFn({ method: "POST" })
  .validator((data : {title: string, details: string, patientId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    return await checkAndWrite("fatal", data.title, data.details, data.patientId);
});

export const error = createServerFn({ method: "POST" })
  .validator((data : {title: string, details: string, patientId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    return await checkAndWrite("error", data.title, data.details, data.patientId);
});

export const warn = createServerFn({ method: "POST" })
  .validator((data : {title: string, details: string, patientId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    return await checkAndWrite("warn", data.title, data.details, data.patientId);
});

export const info = createServerFn({ method: "POST" })
  .validator((data : {title: string, details: string, patientId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    return await checkAndWrite("info", data.title, data.details, data.patientId);
});

export const debug = createServerFn({ method: "POST" })
  .validator((data : {title: string, details: string, patientId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    return await checkAndWrite("debug", data.title, data.details, data.patientId);
});

export const writeLogWithBase = createServerFn({ method: "POST" })
  .validator((data : {base: string, level: LogLevel, title: string, details: string, userId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    if(!checkLevel(data.level)){
      return ok();
    }

    const res = await writeLog(data.base, data.level, data.title, data.details, data.userId);
    return res ? ok() : ng(["書き込みに失敗しました"]);
});

export const getList = createServerFn({ method: "GET" })
  .validator((data : {level: string, fromDate: string, toDate: string, userId: string, patientId: string}) => data)
  .handler(async ({ data }): Promise<Log[]> => {
    const auth = await authenticate(AUTH_READ);
    if(auth.ok){
      const service = new LogListService(new LogRepository(auth.user.base));
      const res = await service.list(data.level, data.fromDate, data.toDate, data.userId, data.patientId)
      return res;
    }
    return [];
});