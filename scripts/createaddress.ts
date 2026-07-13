/// <reference lib="deno.unstable" />
import { readCSV } from "./lib/io.ts"
import { KV_ADDR_PATH } from "./setting.ts"

const EXCLUSION = "以下に掲載がない場合";

const C_POSTALCODE = 2;
const C_ADDR1 = 6;
const C_ADDR2 = 7;
const C_ADDR3 = 8;

const PATH = "./data/utf_ken_all.csv";

const KEY = "address";

async function main(){
    const kv = await Deno.openKv(KV_ADDR_PATH);
    //const kv = await Deno.openKv();
    let i = 0;
    for await (const csv of readCSV(PATH)){
        i++;
        if(i<=0){
            continue;
        }
        if(i>20000){
            return;
        }
        let addr = csv[C_ADDR1] + csv[C_ADDR2];
        const postalCode = csv[C_POSTALCODE];
        if(csv[C_ADDR3] !== EXCLUSION){
            addr += csv[C_ADDR3];
        }
        await kv.set([KEY, postalCode], {
            postalCode: postalCode,
            name: addr,
            plus: ""
        });
        if(i % 10 === 0){
            console.log(i);
        }
    }
    kv.close();
}

await main();