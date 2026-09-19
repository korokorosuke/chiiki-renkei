import { createServerFn, createServerOnlyFn } from "@tanstack/solid-start"
import { LogService } from "../domain/logService.ts"
import { LogListService } from "../domain/logListService.ts"
import { LogRepository } from "../infra/allRepository.ts"
import { verify, authenticate, Auth, Role } from "../lib/auth.ts"
import { type Log, type LogLevel, NO_BASE } from "../domain/log.ts"
import { type Result, ok, ng } from "../lib/response.ts"
import { LOG_LEVEL } from "../settings.ts"

const AUTH_READ = {auth: Auth.LOG, role: Role.READ};

const LOG_ORDER = {"debug":1, "info":2, "warn":3, "error":4, "fatal":5};

export const write = createServerOnlyFn(
    async (level: LogLevel, title: string, details: string, patientId?: string): Promise<Result> => {
  const logOperation = Deno.env.get(LOG_LEVEL);
  const logOrder = LOG_ORDER[level];
  if(!logOperation){
    return ok();
  }
  const logLevel = LOG_ORDER[logOperation as LogLevel];
  if(!logLevel){
    return ok();
  }
  if(logOrder < logLevel){
    return ok();
  }

  const auth = await verify();
  if(auth.ok){
    const service = new LogService(new LogRepository(auth.user.base));
    const res = await service.write(level, title, details, auth.user.id, patientId);
    return res ? ok() : ng(["書き込みに失敗しました"]);
  }else{
    const service = new LogService(new LogRepository(NO_BASE));
    const res = await service.write(level, title, details);
    return res ? ok() : ng(["書き込みに失敗しました"]);
  }
});

export const fatal = createServerFn({ method: "POST" })
  .validator((data : {title: string, details: string, patientId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    return await write("fatal", data.title, data.details, data.patientId);
});

export const error = createServerFn({ method: "POST" })
  .validator((data : {title: string, details: string, patientId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    return await write("error", data.title, data.details, data.patientId);
});

export const warn = createServerFn({ method: "POST" })
  .validator((data : {title: string, details: string, patientId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    return await write("warn", data.title, data.details, data.patientId);
});

export const info = createServerFn({ method: "POST" })
  .validator((data : {title: string, details: string, patientId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    return await write("info", data.title, data.details, data.patientId);
});

export const debug = createServerFn({ method: "POST" })
  .validator((data : {title: string, details: string, patientId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    return await write("debug", data.title, data.details, data.patientId);
});

export const writeLogWithBase = createServerFn({ method: "POST" })
  .validator((data : {base: string, level: LogLevel, title: string, details: string, userId?: string}) => data)
  .handler(async ({ data }): Promise<Result> => {
    const logOperation = Deno.env.get(LOG_LEVEL);
    const logOrder = LOG_ORDER[data.level];
    if(!logOperation){
      return ok();
    }
    const logLevel = LOG_ORDER[logOperation as LogLevel];
    if(!logLevel){
      return ok();
    }
    if(logOrder < logLevel){
      return ok();
    }

    const service = new LogService(new LogRepository(data.base));
    const res = await service.write(data.level, data.title, data.details, data.userId);
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