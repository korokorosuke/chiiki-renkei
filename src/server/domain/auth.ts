import * as base64 from "../../lib/base64.ts"

export class JWTHeader {
    alg = "HS256"
    typ = "JWT"

    toString(): string {
        return JSON.stringify(this);
    }

    encode(): string{
        return base64.encode(this.toString());
    }
}

export class JWTPayload {
    iss: string
    sub: string
    exp: number
    base: string
    name: string
    dept: string
    authf: number
    authr: number
    auths: number
    autha: number
    authm: number
    authw: number
    facid: string

    constructor(appid: string, user: string, expire: number,
            base: string, name: string, dept: string,
            authf: number, authr: number, auths: number,
            autha: number, authm: number, authw: number,
            facid: string) {
        this.iss = appid;
        this.sub = user;
        this.exp = expire;
        this.base = base;
        this.name = name;
        this.dept = dept;
        this.authf = authf;
        this.authr = authr;
        this.auths = auths;
        this.autha = autha;
        this.authm = authm;
        this.authw = authw;
        this.facid = facid
    }

    toString(): string {
        return JSON.stringify(this);
    }

    encode(): string{
        return base64.encode(this.toString());
    }
}