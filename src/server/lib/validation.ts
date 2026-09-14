import type { Result } from "../lib/response.ts"

export type ValidationResult = Result;

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
            return {ok: true};
        }else{
            return {ok: false, errors: valid.error!.issues.map(res=>res.message)};
        }
    };
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