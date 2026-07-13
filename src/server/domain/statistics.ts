import { type ValidationResult, validateNotBlank, validateLength } from "../lib/validation.ts"

export interface Statistics<T>{
    result: T
}

export interface Condition{
    id?: string
    fromDate?: string
    toDate?: string
    facility?: string
    dept?: string
    dr?: string
}

function validateDate(date: string): boolean {
    if(!date){
        return false;
    }
    return !isNaN(new Date(date).getDate());
}

export function validate(cond: Condition): ValidationResult {
    const error: string[] = [];
    let ok = true;
    if(!cond.fromDate || !validateNotBlank(cond.fromDate)){
        error.push("日付開始を入力してください。");
        ok = false;
    }if(cond.fromDate && !validateDate(cond.fromDate)){
        error.push("日付開始が不正です。");
        ok = false;
    }
    if(cond.toDate && !validateDate(cond.toDate)){
        error.push("日付終了が不正です。");
        ok = false;
    }
    if(cond.facility && validateNotBlank(cond.facility) && !validateLength(cond.facility, 20)){
        error.push("施設IDが不正です。");
        ok = false;
    }
    if(cond.dept && validateNotBlank(cond.dept) && !validateLength(cond.dept, 10)){
        error.push("診療科が不正です。");
        ok = false;
    }
    if(cond.dr && validateNotBlank(cond.dr) && !validateLength(cond.dr, 10)){
        error.push("医師が不正です。");
        ok = false;
    }
    return {ok: ok, errors: error};
}