import { LogService } from "../domain/logService.ts"
import { LogRepository } from "../infra/allRepository.ts"

export function logger(base: string): LogService {
  return new LogService(new LogRepository(base));
}

export async function fatal(title: string, details: string|Error|unknown, base: string): Promise<boolean> {
  const log = logger(base);
  return await log.fatal(title, details);
}