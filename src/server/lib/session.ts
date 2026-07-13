import { useSession } from '@tanstack/solid-start/server'
import { SESSION_KEY, PRODUCTION_TYPE, PRODUCTION } from "../settings.ts"

export type SessionData = {
    token: string
    base: string
};

export async function getSessionData(): Promise<SessionData>{
    const val = Deno.env.get(SESSION_KEY);
    if(val){
        const session = await useSession<SessionData>({
            password: val,
            cookie: {
                secure: Deno.env.get(PRODUCTION_TYPE) === PRODUCTION,
                sameSite: 'lax',
                httpOnly: true,
            },
        });
        return {token: session.data.token ?? "", base: session.data.base ?? ""};
    }else{
        return Promise.resolve({token: "", base: ""});
    }
}

export async function setSessionData(data: SessionData): Promise<boolean>{
    const val = Deno.env.get(SESSION_KEY);
    if(val){
        const session = await useSession<SessionData>({
            password: val,
            cookie: {
                secure: Deno.env.get(PRODUCTION_TYPE) === PRODUCTION,
                sameSite: 'lax',
                httpOnly: true,
            },
        });
        try{
            await session.update({token: data.token, base: data.base});
            return Promise.resolve(true);
        }catch(_e){
            return Promise.resolve(false);
        }
    }else{
        return Promise.resolve(false);
    }
}

export async function getBase(): Promise<string>{
    const data = await getSessionData();
    if(data.base){
        return data.base;
    }else{
        throw new Error();
    }
}