import type { IMasterRepository } from "../../domain/masterService.ts"
import { Db } from "./db.ts"
import { master } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"
import { fatal } from "../../lib/log.ts"

type MasterData = typeof master.$inferInsert;

export class MasterRepository implements IMasterRepository {
  database: Db
  base: string

  KEY_KIND: string = "kind"
  KEY_POST: string = "post"
  KEY_FACDEPT: string = "facdept"
  KEY_MEANS: string = "means"
  KEY_CLASSIFICATION: string = "class"
  KEY_PURPOSE: string = "purpose"

  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(kind: string, id: number, val: string): MasterData {
    return {
      base: this.base,
      kind: kind,
      id: id,
      value: val,
    }
  }

  async update(kind: string, values: string[]): Promise<boolean> {
    const db = await this.database.open();
    const res = await db.transaction(async (tx) => {
      try{
        await tx.delete(master).where(
          and(
            eq(master.base, this.base),
            eq(master.kind, kind),
          ));
        await tx.insert(master)
            .values(values.map((val, i) => ({
              base: this.base,
              kind: kind,
              id: i,
              value: val
            })));
        return true;
      }catch(e){
        tx.rollback();
        await fatal(`${this.constructor.name} update`, e, this.base);
        return false;
      }
    });
    this.database.close();
    return res;
  }

  async read(kind: string): Promise<string[]|undefined> {
    if(kind === this.KEY_KIND || kind === this.KEY_POST ||
        kind === this.KEY_FACDEPT || kind === this.KEY_MEANS ||
        kind === this.KEY_CLASSIFICATION ||
        kind === this.KEY_PURPOSE){
      const db = await this.database.open();
      const res = await db.query.master.findMany({
        columns: {
          value: true
        },
        where: {
          base: this.base,
          kind: kind,
        },
        orderBy: {
          id: "asc",
        }
      });
      return res.map(val => val.value);
    }
  }
}