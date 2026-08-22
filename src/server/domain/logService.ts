import type { Log, LogLevel } from "./log.ts"

export interface ILogRepository {
  write(log: Log): Promise<boolean>
}

export class LogService {
  private repos: ILogRepository[]
  constructor(i: ILogRepository){
    this.repos = [i];
  }

  add(i: ILogRepository): void{
    this.repos.push(i);
  }

  getNow(): string{
    return Temporal.Now.plainDateTimeISO().toString({smallestUnit:"second"});
  }

  async write(level: LogLevel, title: string, details: string): Promise<boolean>{
    let result = true;
    const log = {
      level,
      title,
      details,
      datetime: this.getNow(),
    }
    for await(const i of this.repos){
      result = result && await i.write(log);
    }
    return result;
  }

  convertError(e: unknown): string {
    if(e instanceof Error){
      return e.stack ?? e.toString();
    }else if(e instanceof Object){
      return JSON.stringify(e);
    }else if(e){
      return e?.toString();
    }else{
      return "";
    }
  }

  async fatal(title: string, details: string|Error|unknown): Promise<boolean>{
    return await this.write("fatal", title, this.convertError(details));
  }

  async error(title: string, details: string): Promise<boolean>{
    return await this.write("error", title, this.convertError(details));
  }

  async warn(title: string, details: string): Promise<boolean>{
    return await this.write("warn", title, this.convertError(details));
  }

  async info(title: string, details: string): Promise<boolean>{
    return await this.write("info", title, this.convertError(details));
  }

  async debug(title: string, details: string): Promise<boolean>{
    return await this.write("debug", title, this.convertError(details));
  }
}