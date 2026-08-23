import type { Patient, Condition } from "../../domain/patient.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import { Db } from "./db.ts"
import { patient } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"
import { fatal } from "../../lib/log.ts"

type PatientData = typeof patient.$inferInsert;

export type PatientDBResult = {
  id: string,
  lastName: string,
  firstName: string,
  lastKana: string,
  firstKana: string,
  sex: number,
  birthday: string,
  tel: string,
  tel2: string,
  memo: string,
  postalCode: string,
  addressName: string,
  addressPlus: string,
}

export class PatientRepository implements IPatientRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Patient): PatientData {
    return {
      ...val,
      base: this.base,
      birthday: val.birthday,
      postalCode: val.address.postalCode,
      addressName: val.address.name,
      addressPlus: val.address.plus,
    };
  }
  fromData(val: PatientDBResult): Patient {
    return {
      id: val.id,
      lastName: val.lastName,
      firstName: val.firstName,
      lastKana: val.lastKana,
      firstKana: val.firstKana,
      sex: val.sex,
      birthday: val.birthday,
      tel: val.tel,
      tel2: val.tel2,
      memo: val.memo,
      address: {
        postalCode: val.postalCode,
        name: val.addressName,
        plus: val.addressPlus,
      },
    };
  }

  async insert(val: Patient): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.insert(patient).values(this.toData(val));
      return true;
    }catch(e){
      await fatal(`${this.constructor.name} insert`, e, this.base);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Patient): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(patient).set(this.toData(val))
        .where(
          and(
            eq(patient.base, this.base),
            eq(patient.id, val.id),
          ));
      return true;
    }catch(e){
      await fatal(`${this.constructor.name} update`, e, this.base);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Patient): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.delete(patient)
        .where(
          and(
            eq(patient.base, this.base),
            eq(patient.id, val.id),
          ));
      return true;
    }catch(e){
      await fatal(`${this.constructor.name} delete`, e, this.base);
      return false;
    }finally{
      this.database.close();
    }
  }

  async read(id: string): Promise<Patient|undefined> {
    const db = await this.database.open();
    const res = await db.query.patient.findFirst({
      columns: {
        base: false,
      },
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

  async list(cond: Condition): Promise<Patient[]> {
    const db = await this.database.open();
    const res = await db.query.patient.findMany({
      columns: {
        base: false,
      },
      where: {
        base: this.base,
        OR: [
        {
          lastName: {
            like: `%${cond.name}%`,
          },
        },
        {
          firstName: {
            like: `%${cond.name}%`,
          },
        },
        {
          lastKana: {
            like: `%${cond.name}%`,
          },
        },
        {
          firstKana: {
            like: `%${cond.name}%`,
          },
        }],
      }
    });
    if(res.length > 0){
      return res.map((pat) => this.fromData(pat));
    }
    return [];
  }
}