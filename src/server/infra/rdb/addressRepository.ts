import type { Address } from "../../domain/address.ts"
import type { IAddressRepository } from "../../domain/addressService.ts"
import { Db } from "./db.ts"
import { address } from "../../db/schema.ts"
import { eq } from "drizzle-orm"

export class AddressRepository implements IAddressRepository {
  database: Db
  constructor(){
    this.database = new Db();
  }

  async insert(val: Address): Promise<boolean> {
    const db = await this.database.open();
    const res = (await db.insert(address).values(val)).rowsAffected;
    return res >= 1;
  }

  async update(val: Address): Promise<boolean> {
    const db = await this.database.open();
    const res = (await db.update(address).set(val)
      .where(eq(address.postalCode, val.postalCode))).rowsAffected;
    return res >= 1;
  }

  async delete(val: Address): Promise<void> {
    const db = await this.database.open();
    (await db.delete(address)
      .where(eq(address.postalCode, val.postalCode))).rowsAffected;
  }

  async read(postalCode: string): Promise<Address|undefined> {
    const db = await this.database.open();
    const res = await db.query.address.findFirst({
      where: {
        postalCode: postalCode
      }
    });
    return res;
  }
}