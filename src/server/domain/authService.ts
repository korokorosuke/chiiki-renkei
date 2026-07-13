import { JWTHeader, JWTPayload } from "./auth.ts"
import * as base64 from "../../lib/base64.ts"
import { Crypto } from "../../lib/crypto.ts"
import type { AuthUser } from "./user.ts"
import { APP_ID, SECRET_KEY } from "../settings.ts"

export interface IAuthRepository{
    update(user: string, token: string ): Promise<boolean>
    delete(user: string): Promise<void>
    read(user: string): Promise<string>
}

export class AuthService{
    static readonly APP_EXPIRE = 60 * 60 * 24; //seconds

    static authFacility(token: string, authority: number): boolean {
        const payload = AuthService.payload(token)
        if(authority === 1){
            return payload.authf >= authority || payload.authw >= authority;
        }else{
            return payload.authf >= authority;
        }
    }
    static authMaster(token: string, authority: number): boolean {
        const payload = AuthService.payload(token)
        return payload.authm >= authority;
    }
    static authReferral(token: string, authority: number):boolean {
        const payload = AuthService.payload(token)
        return payload.authr >= authority;
    }
    static authStatistics(token: string, authority: number): boolean {
        const payload = AuthService.payload(token)
        return payload.auths >= authority;
    }
    static authActivity(token: string, authority: number): boolean {
        const payload = AuthService.payload(token)
        return payload.autha >= authority;
    }
    static authWeb(token: string, authority: number): boolean {
        const payload = AuthService.payload(token)
        return payload.authw >= authority;
    }

    static toUser(payload: JWTPayload): AuthUser {
        return {
            id: payload.sub,
            name: payload.name,
            department: payload.dept,
            base: payload.base,
            authActivity: payload.autha,
            authFacility: payload.authf,
            authMaster: payload.authm,
            authReferral: payload.authr,
            authStatistics: payload.auths,
            authWeb: payload.authw,
            facilityId: payload.facid
        };
    }

    static getUser(token: string): AuthUser{
        const payload = AuthService.payload(token);
        return this.toUser(payload)
    }

    static getSeconds(): number{
        return new Date().getTime() / 1000;
    }

    static async validate(token: string): Promise<{ok: boolean, user: AuthUser|undefined}>{
        const payload = AuthService.payload(token);
        if(APP_ID !== payload.iss){
            return {ok: false, user: undefined};
        }

        const secret = await AuthService.getSecret(payload.sub);
        if(!await AuthService.verify(secret, token)){
            return {ok: false, user: undefined};
        }
        const result = payload.exp > (AuthService.getSeconds());
        return {ok: result, user: AuthService.toUser(payload)};
    }

    static async sign(secret: string|Uint8Array<ArrayBuffer>, user: AuthUser): Promise<string>{
        const header = new JWTHeader().encode();

        const payload = new JWTPayload(APP_ID, user.id,
            Math.floor(AuthService.getSeconds()) + AuthService.APP_EXPIRE,
            user.base, user.name, user.department,
            user.authFacility, user.authReferral, user.authStatistics,
            user.authActivity, user.authMaster, user.authWeb,
            user.facilityId ?? "")
            .encode();

        const data = `${header}.${payload}`;

        const signature = await Crypto.sign(secret, data);

        return `${data}.${base64.encode(signature)}`;
    }

    static async verify(secret: string|Uint8Array<ArrayBuffer>, data: string): Promise<boolean> {
        const ar = data.split(".");
        return await Crypto.verify(secret, base64.decode(ar[2]).buffer, `${ar[0]}.${ar[1]}`);
    }

    static payload(token: string): JWTPayload {
        const ar = token.split(".");
        return JSON.parse(Crypto.decode(base64.decode(ar[1])));
    }

    static async sha256(s: string): Promise<Uint8Array<ArrayBuffer>> {
        return new Uint8Array(await Crypto.sha256(Crypto.encode(s)));
    }

    static async getSecret(id: string): Promise<Uint8Array<ArrayBuffer>> {
        const secret = Deno.env.get(SECRET_KEY)
        return await AuthService.sha256(`__${id}_:_${secret}__`);
    }
}