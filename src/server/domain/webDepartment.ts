import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const webDepartmentSchema = z.object({
    id: z.string()
        .min(1, "ＩＤを入力してください。")
        .max(10, "ＩＤは１０文字までです。"),
    name: z.string()
        .min(1, "名前を入力してください。")
        .max(100, "名前は１００文字までです。"),
    description: z.string()
        .max(100, "説明は１００文字までです。")
}).required({
    id: true, name: true,
});

export type WebDepartment = z.infer<typeof webDepartmentSchema>;

export const validate = validater<WebDepartment>(webDepartmentSchema);

export function initialize(): WebDepartment{
    return {
        id: "",
        name: "",
        description: "",
    }
}