import { get } from "../server/func/auth.ts"
import type { AuthUser } from "../server/domain/user.ts"

export async function auth(): Promise<AuthUser|undefined>{
    const res = await get();
    if(res.ok){
        return res.data;
    }
    return undefined;
}

export async function authOrJump(path?: string): Promise<AuthUser|undefined>{
    const user = await auth();
    if(user){
        return user;
    }
    if(path){
        location.href = `/login?src=${path}`;
    }else{
        location.href = "/login";
    }
    return undefined;
}