import { type SessionData, getSessionData } from "./session.ts"
import { AuthService } from "../domain/authService.ts"
import type { AuthUser } from "../domain/user.ts"

export interface AuthResult{
    ok: boolean
    user?: AuthUser
    errors?: string[]
}

export interface AuthOption{
    auth: Auth
    role: Role
}

export function auth(auth: AuthOption|AuthOption[]) {
    // deno-lint-ignore no-explicit-any
    return function deco(orig: any, _: ClassMethodDecoratorContext) {
        // deno-lint-ignore no-explicit-any
        return async function retFunc(this: any, ...args: any[]) {
            const res = await authenticate(auth);
            if(res.ok){
                return orig.call(this, ...args);
            }
            return res;
        }
    }
}

export async function authenticate(authoptions: AuthOption | AuthOption[]): Promise<AuthResult> {
    const options = Array.isArray(authoptions) ? authoptions : [authoptions];
    const res = await verify(options);
    if(res.ok && res.user){
        return {ok: true, user: res.user};
    }else{
        return {ok: false, errors: res.errors};
    }
}

export async function verify(authoptions?: AuthOption[]): Promise<AuthResult> {
    const data: SessionData = await getSessionData();
    if(data.token){
        const res = await AuthService.validate(data.token);
        if(res.ok && res.user){
            if(authoptions){
                if(checkMulti(authoptions, res.user)){
                    return {ok: true, user: res.user};
                }else{
                    return {ok: false, errors: ["権限がありません。"]};
                }
            }
            return {ok: true, user: res.user};
        }
        return {ok: false, errors: ["権限がありません。"]};
    }
    return {ok: false, errors: ["認証されていません。"]};
}

function checkMulti(authoptions: AuthOption[], user: AuthUser): boolean {
    for(const option of authoptions){
        if(check(option.auth, option.role, user)){
            return true;
        }
    }
    return false;
}

function check(auth: Auth, role: Role, user: AuthUser): boolean {
    if(auth === Auth.REFERRAL){
        return user.authReferral >= role;
    }else if(auth === Auth.APPOINT){
        return user.authActivity >= role;
    }else if(auth === Auth.FACILITY){
        return user.authFacility >= role;
    }else if(auth === Auth.MASTER){
        return user.authMaster >= role;
    }else if(auth === Auth.WEB){
        return user.authWeb >= role;
    }else if(auth === Auth.STATISTICS){
        return user.authStatistics >= role;
    }
    return false;
}

export const enum Role {
    NONE = 0,
    READ = 1,
    WRITE = 2
}

export const enum Auth {
    MASTER = "master",
    WEB = "web",
    STATISTICS = "statistics",
    REFERRAL = "referral",
    APPOINT = "appoint",
    FACILITY = "facility"
}