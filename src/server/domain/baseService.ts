import { v7 } from "@std/uuid"
import { ok, ng, type Result } from "../lib/response.ts"
import type { ValidationResult } from "../lib/validation.ts"
import { getNow } from "../lib/datetime.ts"


export interface IReadRepository<T>{
    read(id: string): Promise<T|undefined>
}

export interface IWriteRepository<T>{
    insert(d: T): Promise<boolean>
    update(d: T): Promise<boolean>
    delete(d: T): Promise<boolean>
}

export interface IRepository<T> extends IReadRepository<T>, IWriteRepository<T>{}

export interface IIdentifiable{
    id: string
}

interface ICreatedAt{
    createdAt?: string
}

interface IUpdatedAt{
    updatedAt?: string
}

export function generateId(): string{
    return v7.generate();
}

export function setId(val: IIdentifiable): void{
    val.id = generateId();
}

export class BaseWriteService<T, R extends IWriteRepository<T>>{
    protected i: R
    private validate: (val: T)=>ValidationResult
    private createId: (val: IIdentifiable)=>void

    constructor(i: R, validate: (val: T)=>ValidationResult,
            createId: (val: IIdentifiable)=>void = (_)=>{}){
        this.i = i;
        this.validate = validate;
        this.createId = createId;
    }

    protected getRepository(): R{
        return this.i;
    }

    // deno-lint-ignore no-explicit-any
    protected isIdentifiable(val: any): val is IIdentifiable{
        return "id" in val;
    }

    // deno-lint-ignore no-explicit-any
    protected isCreatedAt(val: any): val is ICreatedAt{
        return "createdAt" in val;
    }

    // deno-lint-ignore no-explicit-any
    protected isUpdatedAt(val: any): val is IUpdatedAt{
        return "updatedAt" in val;
    }

    async insert(val: T): Promise<Result>{
        const res = this.validate(val);
        if(res.ok){
            if(this.isIdentifiable(val)){
                this.createId(val);
            }
            const now = getNow();
            if(this.isCreatedAt(val)){
                val.createdAt = now;
            }
            if(this.isUpdatedAt(val)){
                val.updatedAt = now;
            }

            if(await this.i.insert(val)){
                return ok();
            }else{
                return ng(["登録に失敗しました。"]);
            }
        }else{
            return ng(res.errors!);
        }
    }

    async update(val: T): Promise<Result>{
        const res = this.validate(val);
        if(res.ok){
            if(this.isUpdatedAt(val)){
                val.updatedAt = getNow();
            }

            if(await this.i.update(val)){
                return ok();
            }else{
                return ng(["登録に失敗しました。"]);
            }
        }else{
            return ng(res.errors!);
        }
    }

    async delete(val: T): Promise<Result>{
        const res = await this.i.delete(val);
        if(res){
            return ok();
        }else{
            return ng(["削除に失敗しました。"]);
        }
    }
}

export class BaseService<T, R extends IRepository<T>> extends BaseWriteService<T, R>{
    constructor(i: R, validate: (val: T)=>ValidationResult,
        createId: (val: IIdentifiable)=>void = (_)=>{}){
      super(i, validate, createId);
    }

    async get(id: string): Promise<T|undefined>{
        return await this.i.read(id);
    }
}