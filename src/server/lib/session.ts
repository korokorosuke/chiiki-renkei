import { getCookie, setCookie } from "@tanstack/solid-start/server"
import { getIronSession, type IronSession } from "iron-session"
import { SESSION_KEY, PRODUCTION_TYPE, PRODUCTION } from "../settings.ts"
import type { Base } from "../domain/base.ts"

export type SessionData = {
    token: string
    base: Base | undefined
};

async function getSession(): Promise<IronSession<SessionData>|undefined>{
  const val = Deno.env.get(SESSION_KEY);
  const ttl = 7 * 24 * 60 * 60;
  if(val){
    return await getIronSession<SessionData>(
        { read: getCookie, write: setCookie },
        {
            cookieName: "reco-app-session",
            password: val,
            ttl,
            cookieOptions: {
                secure: Deno.env.get(PRODUCTION_TYPE) === PRODUCTION,
                sameSite: "lax",
                httpOnly: true,
                path: "/",
            },
        },
    );
  }
  return undefined
}

export async function clear(): Promise<void> {
    const session = await getSession();
    if(session){
        session.destroy();
    }
}

export async function getSessionData(): Promise<SessionData>{
    const session = await getSession();
    if(session){
        return {token: session.token ?? "", base: session.base ?? undefined};
    }else{
        return Promise.resolve({token: "", base: undefined});
    }
}

export async function setSessionData(data: SessionData): Promise<boolean>{
    const session = await getSession();
    if(session){
        try{
            session.token = data.token;
            session.base = data.base;
            await session.save();
            return Promise.resolve(true);
        }catch(_e){
            return Promise.resolve(false);
        }
    }else{
        return Promise.resolve(false);
    }
}

export async function getBase(): Promise<Base>{
    const data = await getSessionData();
    if(data.base){
        return data.base;
    }else{
        throw new Error();
    }
}

export async function setBase(base: Base): Promise<boolean>{
    const data = await getSessionData();
    return await setSessionData({token: data.token, base: base});
}