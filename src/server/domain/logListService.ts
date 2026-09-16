import type { Log } from "./log.ts"

export interface ILogListRepository {
  list(level: string, fromDate: string, toDate: string, userId: string, patientId: string): Promise<Log[]>
}

export class LogListService {
  private repos: ILogListRepository
  constructor(i: ILogListRepository){
    this.repos = i;
  }

  async list(level: string, fromDate: string, toDate: string, userId: string, patientId: string): Promise<Log[]>{
    return await this.repos.list(level, fromDate, toDate, userId, patientId);
  }
}