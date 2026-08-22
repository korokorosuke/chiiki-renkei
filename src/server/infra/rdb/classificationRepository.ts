import type { Classification } from "../../domain/classification.ts"
import type { IClassificationRepository } from "../../domain/classificationService.ts"
import { Db } from "./db.ts"
import { classification } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"
import { LogService } from "../../domain/logService.ts"
import { LogRepository } from "./logRepository.ts"

type ClassificationData = typeof classification.$inferInsert;

export class ClassificationRepository implements IClassificationRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Classification): ClassificationData {
    return {
      base: this.base,
      id: val.id,
      name: val.name,
      done: val.done
    };
  }
  fromData(val: ClassificationData): Classification {
    return {
      id: val.id,
      name: val.name,
      done: val.done
    };
  }

  async insert(val: Classification): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(classification).values(this.toData(val));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} insert`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Classification): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(classification).set(this.toData(val))
        .where(
          and(
            eq(classification.base, this.base),
            eq(classification.id, val.id),
          ));
      return true;
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} update`, e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Classification): Promise<void> {
    try{
      const db = await this.database.open();
      await db.delete(classification)
        .where(
          and(
            eq(classification.base, this.base),
            eq(classification.id, val.id),
          ));
    }catch(e){
      new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} delete`, e);
    }finally{
      this.database.close();
    }
  }

  async read(id: string): Promise<Classification|undefined> {
    const db = await this.database.open();
    const res = await db.query.classification.findFirst({
      where: {
        base: this.base,
        id: id
      }
    });
    if(res){
      return this.fromData(res);
    }
    return undefined;
  }

  async all(): Promise<Classification[]> {
    const db = await this.database.open();
    const res = await db.query.classification.findMany({
      where: {
        base: this.base
      }
    });
    if(res.length > 0){
      return res.map(val => this.fromData(val));
    }
    return [];
  }
}