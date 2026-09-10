import type { Base } from "./base.ts"

export interface IBaseRepository{
  read(id: string): Promise<Base|undefined>
  insert(base: Base): Promise<boolean>
}

export class BaseService{
  constructor(private repository: IBaseRepository) { }

  async get(id: string): Promise<Base|undefined> {
    return await this.repository.read(id);
  }
}