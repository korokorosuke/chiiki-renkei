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
    try{
      const db = await this.database.open();
      await db.insert(address).values(val);
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async update(val: Address): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.update(address).set(val)
        .where(eq(address.postalCode, val.postalCode));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
  }

  async delete(val: Address): Promise<boolean> {
    try{
      const db = await this.database.open();
      await db.delete(address)
        .where(eq(address.postalCode, val.postalCode));
      return true;
    }catch(e){
      console.log(e);
      return false;
    }finally{
      this.database.close();
    }
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