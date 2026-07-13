import type { Facility } from "../../domain/facility.ts"
import type { IFacilityRepository } from "../../domain/facilityService.ts"
import { Db } from "./db.ts"
import { facility, facilityContact } from "../../db/schema.ts"
import { type UserDBResult, toUser } from "./types.ts"
import { and, eq } from "drizzle-orm"

type FacilityData = typeof facility.$inferInsert;

type FacilityDBResult = {
  id: string,
  attribute: string,
  nameCorp: string,
  name: string,
  kana: string,
  tel: string,
  fax: string,
  email: string,
  facilityContacts: {
    tel: string,
    fax: string,
    email: string,
    name: string,
  }[],
  postalCode: string,
  addressName: string,
  addressPlus: string,
  memo: string,
  closedDate: string,
  facilityCreatedBy: UserDBResult | null,
  createdAt: string,
  facilityUpdatedBy: UserDBResult | null,
  updatedAt: string,
}

export class FacilityRepository implements IFacilityRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Facility): FacilityData {
    return {
      ...val,
      base: this.base,
      postalCode: val.address.postalCode,
      addressName: val.address.name,
      addressPlus: val.address.plus,
      createdBy: val.updatedBy.id,
      updatedBy: val.updatedBy.id,
    };
  }
  toDataWithoutKey(act: Facility): Partial<FacilityData> {
    // deno-lint-ignore no-unused-vars
    const {base, id, ...etc} = this.toData(act);
    return etc;
  }
  fromData(val: FacilityDBResult): Facility {
    return {
      id: val.id,
      attribute: val.attribute,
      nameCorp: val.nameCorp,
      name: val.name,
      kana: val.kana,
      tel: val.tel,
      fax: val.fax,
      email: val.email,
      contacts: val.facilityContacts,
      address: {
        postalCode: val.postalCode,
        name: val.addressName,
        plus: val.addressPlus,
      },
      memo: val.memo,
      closedDate: val.closedDate,
      createdAt: val.createdAt,
      createdBy: toUser(val.facilityCreatedBy),
      updatedAt: val.updatedAt,
      updatedBy: toUser(val.facilityUpdatedBy),
    };
  }

  async insert(val: Facility): Promise<boolean> {
    const db = await this.database.open();
    const res: number = await db.transaction(async (tx) => {
      const res1 = (await tx.insert(facility).values(this.toData(val))).rowsAffected;
      if(res1 >= 1){
        if(val.contacts.length > 0){
          const res2 = (await tx.insert(facilityContact)
            .values(val.contacts.map(contact => ({
              base: this.base,
              facilityId: val.id,
              tel: contact.tel,
              fax: contact.fax,
              email: contact.email,
              name: contact.name,
            })))).rowsAffected;
          if(res2 === 0){
            tx.rollback();
            return 0;
          }
        }
        return res1;
      }
      tx.rollback()
      return 0;
    });
    return res >= 1;
  }

  async update(val: Facility): Promise<boolean> {
    const db = await this.database.open();
    const res: number = await db.transaction(async (tx) => {
      const res1 = (await tx.update(facility).set(this.toDataWithoutKey(val))
        .where(eq(facility.id, val.id))).rowsAffected;
      if(res1 >= 1){
        await tx.delete(facilityContact).where(
          and(
            eq(facilityContact.base, this.base),
            eq(facilityContact.facilityId, val.id),
          ));
        if(val.contacts.length > 0){
          const res2 = (await tx.insert(facilityContact)
            .values(val.contacts.map(contact => ({
              base: this.base,
              facilityId: val.id,
              tel: contact.tel,
              fax: contact.fax,
              email: contact.email,
              name: contact.name,
            })))).rowsAffected;
          if(res2 === 0){
            tx.rollback();
            return 0;
          }
        }
        return res1;
      }
      tx.rollback()
      return 0;
    });
    return res >= 1;
  }

  async delete(val: Facility): Promise<void> {
    const db = await this.database.open();
    await db.transaction(async (tx) => {
      await tx.delete(facilityContact).where(
        and(
          eq(facilityContact.base, this.base),
          eq(facilityContact.facilityId, val.id),
        ));
      (await tx.delete(facility)
        .where(
          and(
            eq(facility.base, this.base),
            eq(facility.id, val.id),
          ))).rowsAffected;
    });
  }

  private async select(cond: object): Promise<FacilityDBResult[]> {
    const db = await this.database.open();
    const res = await db.query.facility.findMany({
      columns: {
        base: false,
        createdBy: false,
        updatedBy: false,
      },
      with: {
        facilityContacts: {
          columns: {
            tel: true,
            fax: true,
            email: true,
            name: true,
          }
        },
        facilityCreatedBy: {
          columns: {
            id: true,
            name: true,
            departmentId: true,
          }
        },
        facilityUpdatedBy: {
          columns: {
            id: true,
            name: true,
            departmentId: true,
          }
        },
      },
      where: cond,
    });
    return res;
  }

  async read(id: string): Promise<Facility|undefined> {
    const res = await this.select({
      base: this.base,
      id: id
    });
    if(res.length > 0){
      return this.fromData(res[0]);
    }
    return undefined;
  }

  async list(name: string): Promise<Facility[]> {
    const res = await this.select({
      base: this.base,
      name: {
        like: `%${name}%`,
      },
    });
    return res.map(this.fromData);
  }
}