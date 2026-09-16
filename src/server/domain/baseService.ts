import { type Base, validate } from "./base.ts"
import { ok, ng, type Result } from "../lib/response.ts"

export interface IBaseRepository{
  read(id: string): Promise<Base|undefined>
  insert(base: Base): Promise<boolean>
  update(base: Base): Promise<boolean>
}

export class BaseService{
  constructor(private repository: IBaseRepository) { }

  async get(id: string): Promise<Base|undefined> {
    return await this.repository.read(id);
  }

  async update(val: Base): Promise<Result> {
    const res = validate(val);
    if(res.ok){
      if(await this.repository.update(val)){
        return ok();
      }else{
        return ng(["登録に失敗しました。"]);
      }
    }else{
      return ng(res.errors!);
    }
  }
}