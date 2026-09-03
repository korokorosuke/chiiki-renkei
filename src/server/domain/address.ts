import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const addressBaseSchema = z.object({
    postalCode: z.string(),
    name: z.string(),
    plus: z.string(),
});

export const addressSchema = z.object({
    postalCode: z.string("郵便番号を入力してください。")
        .min(1, "郵便番号を入力してください。")
        .regex(/^[0-9]{3}-?[0-9]{4}$/, "郵便番号が不正です。"),
    name: z.string("住所を入力してください。")
        .min(1, "住所を入力してください。")
        .max(100, "住所は１００文字までです。"),
    plus: z.string().max(100, "住所（建物等）は１００文字までです。"),
}).required({
    postalCode: true,
    name: true,
});

export type Address = z.infer<typeof addressSchema>;

export const validate = validater<Address>(addressSchema);

export function initialize(): Address {
    return {
        postalCode: "",
        name: "",
        plus: ""
    }
}

/**
 * hyphen(-) removed postal code
 *
 * @param postalCode - postal code
 * @return postal code without hyphen
 */
export function toNumberCode(postalCode: string): string{
    if(postalCode.trim().indexOf("-")===3){
        return postalCode.trim().replace("-", "");
    }
    return postalCode;
}

/**
 * hyphen(-) added postal code
 *
 * @param postalCode - postal code
 * @return postal code
 */
export function toPostalCode(postalCode: string): string{
    if(postalCode.indexOf("-") >= 0){
        return postalCode;
    }else{
        return postalCode.substring(0, 3) + "-" + postalCode.substring(3, 7);
    }
}