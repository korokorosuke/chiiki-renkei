import { DB_URL } from "../src/server/settings.ts"
let path = Deno.env.get(DB_URL);
if(!path){
  path = "reco.db";
}
export const KV_PATH = path;