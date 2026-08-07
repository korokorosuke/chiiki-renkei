import { Crypto } from "../src/lib/crypto.ts"
import { encode } from "../src/lib/base64.ts"
import { SECRET_KEY, SESSION_KEY } from "../src/server/settings.ts"

const bs = encode(Crypto.generateBytes(32));
console.log(SECRET_KEY);
console.log(bs);

const bs2 = encode(Crypto.generateBytes(32));
console.log(SESSION_KEY);
console.log(bs2);

if(Deno.build.os === "windows"){
  let cmd = new Deno.Command("setx", { args: [SECRET_KEY, bs] });
  await cmd.output();
  cmd = new Deno.Command("setx", { args: [SESSION_KEY, bs2] });
  await cmd.output();
}