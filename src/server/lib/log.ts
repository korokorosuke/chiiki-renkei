import { type LogLevel, NO_BASE } from "../domain/log.ts"
import { LogService } from "../domain/logService.ts"
import { LogRepository } from "../infra/allRepository.ts"
import { verify } from "./auth.ts"
import { type Result, ok, ng } from "./response.ts"
import { LOG_LEVEL } from "../settings.ts"
import { getBase } from "./session.ts"

const LOG_ORDER = {"debug":1, "info":2, "warn":3, "error":4, "fatal":5};

/**
 * check log level by env data
 *
 * @param level - log level
 * @return true if log level is enabled, false otherwise
 */
export function checkLevel(level: LogLevel): boolean {
  const logOperation = Deno.env.get(LOG_LEVEL);
  const logOrder = LOG_ORDER[level];
  if(!logOperation){
    return false;
  }
  const logLevel = LOG_ORDER[logOperation as LogLevel];
  if(!logLevel){
    return false;
  }
  if(logOrder < logLevel){
    return false;
  }
  return true;
}

function logger(base: string): LogService {
  return new LogService(new LogRepository(base));
}

/**
 * write log(authenticated)
 *
 * @param level - log level
 * @param title - log title
 * @param details - log details
 * @param patientId? - patient id
 * @return Promise<Result>
 */
export async function checkAndWrite(level: LogLevel, title: string, details: string|Error|unknown,
    patientId?: string): Promise<Result> {
  if(!checkLevel(level)){
    return ok();
  }
  return await write(level, title, details, undefined, patientId);
}

/**
 * write log
 *
 * @param level - log level
 * @param title - log title
 * @param details - log details
 * @param userId? - user id
 * @param patientId? - patient id
 * @param base? - base id
 * @return Promise<Result>
 */
export async function write(level: LogLevel, title: string, details: string|Error|unknown,
    userId?: string, patientId?: string, base?: string): Promise<Result> {
  if(!userId){
    const res = await verify();
    if(res.ok){
      userId = res.user.id;
      base = res.user.base;
    }
  }
  if(!base){
    const b = await getBase();
    if(b.id){
      base = b.id;
    }else{
      base = NO_BASE;
    }
  }
  const service = logger(base);
  const res = await service.write(level, title, details, userId, patientId);
  return res ? ok() : ng(["書き込みに失敗しました"]);
}

/**
 * write log
 *
 * @param base - base id
 * @param level - log level
 * @param title - log title
 * @param details - log details
 * @param userId? - user id
 * @param patientId? - patient id
 * @return Promise<Result>
 */
export async function writeLogWithBase(base: string, level: LogLevel, title: string, details: string|Error|unknown,
    userId?: string, patientId?: string): Promise<boolean> {
  const res = await write(level, title, details, userId, patientId, base);
  return res.ok;
}

export async function fatal(title: string, details: string|Error|unknown, base: string,
    userId?: string, patientId?: string): Promise<boolean> {
  return await writeLogWithBase(base, "fatal", title, details, userId, patientId);
}

export async function error(title: string, details: string|Error|unknown, base: string,
    userId?: string, patientId?: string): Promise<boolean> {
  return await writeLogWithBase(base, "error", title, details, userId, patientId);
}

export async function warn(title: string, details: string|Error|unknown, base: string,
    userId?: string, patientId?: string): Promise<boolean> {
  return await writeLogWithBase(base, "warn", title, details, userId, patientId);
}

export async function info(title: string, details: string|Error|unknown, base: string,
    userId?: string, patientId?: string): Promise<boolean> {
  return await writeLogWithBase(base, "info", title, details, userId, patientId);
}

export async function debug(title: string, details: string|Error|unknown, base: string,
    userId?: string, patientId?: string): Promise<boolean> {
  return await writeLogWithBase(base, "debug", title, details, userId, patientId);
}