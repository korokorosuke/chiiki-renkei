import type { Result } from "../lib/response.ts"

export interface ValidationResult extends Result {
    ok: boolean
    errors?: string[]
}

interface Schema {
    // deno-lint-ignore no-explicit-any
    safeParse: (data: any) => {
        success: boolean,
        error?: { issues: { message: string }[] }
    }
}

export function validater<T>(schema: Schema): (val: T) => ValidationResult {
    return (val: T): ValidationResult => {
        const valid = schema.safeParse(val);
        if(valid.success){
            return {ok: true, errors: []};
        }else{
            return {ok: false, errors: valid.error!.issues.map(res=>res.message)};
        }
    };
}

export function validateNotBlank(s: string): boolean {
    if(s == undefined){
        return false;
    }
    return s.trim() !== "";
}

export function validateLength(s: string, length: number): boolean{
    return s.length <= length;
}

export function validateTel(tel: string): boolean {
    if(!tel){
        return false;
    }
    tel = tel.trim();
    if(tel.length > 13){
        return false;
    }
    return /^[0-9]+-?[0-9]+-?[0-9]+$/.test(tel);
}

export function validateEmail(email: string): boolean {
    if(!email){
        return false;
    }
    email = email.trim();
    if(email.length > 50){
        return false;
    }
    return /^[0-9a-zA-Z.+]+@[0-9a-zA-Z]+.[0-9a-zA-Z.]+$/.test(email);
}

export function validatePostalCode(postal: string): boolean {
    if(!postal){
        return false;
    }
    postal = postal.trim();
    if(postal.length > 8){
        return false;
    }
    return /^[0-9]{3}-?[0-9]{4}$/.test(postal);
}

export function validatePassword(password: string){
    if(!password){
        return false;
    }
    password = password.trim();
    if(password.length < 10){
        return false;
    }
    if(password === ""){
        return false;
    }
    if(!/[0-9]/.test(password)){
        return false;
    }
    if(!/[a-z]/.test(password)){
        return false;
    }
    if(!/[A-Z]/.test(password)){
        return false;
    }
    if(!/^[0-9a-zA-Z.,/i\\!"#$%&'()=~|{}*+:;'\[\]<>?_^@-]+$/.test(password)){
        return false;
    }
    return true;
}