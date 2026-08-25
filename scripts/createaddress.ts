/// <reference lib="deno.unstable" />
import { readCSV } from "./lib/io.ts"
import { DB_TYPE_KEY } from "../src/server/settings.ts"
import { AddressRepository } from "../src/server/infra/addressRepository.ts"
import { AddressRepository as RdbAddressRepository } from "../src/server/infra/rdb/addressRepository.ts"

const CSV_PATH = "./data/utf_ken_all.csv";

const EXCLUSION = "以下に掲載がない場合";

const C_POSTALCODE = 2;
const C_ADDR1 = 6;
const C_ADDR2 = 7;
const C_ADDR3 = 8;

async function main(): Promise<boolean>{
  const dbType = Deno.env.get(DB_TYPE_KEY);
  let addressRepository;
  if(dbType === "postgresql"){
    addressRepository = new RdbAddressRepository();
  }else{
    addressRepository = new AddressRepository();
  }
  let i = 0;
  for await (const csv of readCSV(CSV_PATH)){
    i++;
    let addr = csv[C_ADDR1] + csv[C_ADDR2];
    const postalCode = csv[C_POSTALCODE];
    if(csv[C_ADDR3] !== EXCLUSION){
      addr += csv[C_ADDR3];
    }
    await addressRepository.insert({
      postalCode: postalCode,
      name: addr,
      plus: ""
    });
    if(i % 10 === 0){
      console.log(i, postalCode);
    }
  }
  return true;
}

await main();