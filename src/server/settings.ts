export const APP_ID = "CHIIKI-RENKEI";

export const SESSION_KEY = "RECO_SESSION";
export const PRODUCTION_TYPE = "RECO_PRODUCTION";
export const PRODUCTION = "production";
export const SECRET_KEY = "RECO_SECRET";

export const ADDRESS_URL = "RECO_ADDRESS_URL";
export const PATIENT_URL = "RECO_PATIENT_URL";

export const DB_TYPE_KEY = "RECO_DB_TYPE";
export const DB_URL_KEY = "RECO_DB_URL";

export type DbType = "postgresql" | "sqlite";

export const DB_TYPE: DbType = Deno.env.get(DB_TYPE_KEY) as DbType ?? "postgresql";
export const DB_URL = Deno.env.get(DB_URL_KEY) ?? "";

//export const DB_TYPE = "postgresql";
//export const DB_URL = "postgresql://user:password@hostname/dbname";
//export const DB_TYPE = "sqlite";
//export const DB_URL = "reco.db";