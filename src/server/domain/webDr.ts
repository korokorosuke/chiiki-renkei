import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const webDrBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    department: z.string()
});

export const webDrSchema = z.object({
    id: z.string()
        .min(1, "ＩＤを入力してください。")
        .max(10, "ＩＤは１０文字までです。"),
    name: z.string()
        .min(1, "名前を入力してください。")
        .max(30, "名前は３０文字までです。"),
    displayName: z.string()
        .min(1, "表示名を入力してください。")
        .max(30, "表示名は３０文字までです。"),
    department: z.string()
        .min(1, "部署を入力してください。")
        .max(10, "部署は１０文字までです。"),
}).required({
    id: true, name: true, displayName: true, department: true,
});

export type WebDr = z.infer<typeof webDrSchema>;

export const validate = validater<WebDr>(webDrSchema);

export function initialize(): WebDr{
    return {
        id: "",
        name: "",
        displayName: "",
        department: "",
    }
}