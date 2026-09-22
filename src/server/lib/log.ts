import { LogService } from "../domain/logService.ts"
import { LogRepository } from "../infra/allRepository.ts"
import { verify } from "./auth.ts"

function logger(base: string): LogService {
  return new LogService(new LogRepository(base));
}

export async function fatal(title: string, details: string|Error|unknown, base: string,
    userId?: string, patientId?: string): Promise<boolean> {
  if(!userId){
    const res = await verify();
    if(res.ok){
      userId = res.user.id;
    }
  }
  const log = logger(base);
  return await log.fatal(title, details, userId, patientId);
}