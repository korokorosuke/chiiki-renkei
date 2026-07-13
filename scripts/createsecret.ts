import { Crypto } from "../src/lib/crypto.ts"
import { encode } from "../src/lib/base64.ts"
import { SECRET_KEY, SESSION_KEY } from "../src/server/settings.ts"

const bs = encode(Crypto.generateBytes(32));
Deno.env.set(SECRET_KEY, bs);

const bs2 = encode(Crypto.generateBytes(32));
Deno.env.set(SESSION_KEY, bs2);