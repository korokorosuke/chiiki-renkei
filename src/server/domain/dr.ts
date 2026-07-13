import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const drBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    department: z.string(),
});

export const drSchema = drBaseSchema.extend({
    id: z.string("ＩＤを入力してください。")
        .min(1, "ＩＤを入力してください。")
        .max(10, "ＩＤは１０文字までです."),
    name: z.string()
        .min(1, "名前を入力してください。")
        .max(100, "名前は１００文字までです."),
    department: z.string()
        .min(1, "部署を入力してください.")
        .max(10, "部署は１０文字までです."),
}).required({
    id: true, name: true, department: true
});

export type Dr = z.infer<typeof drSchema>;

export const validate = validater<Dr>(drSchema);

export function initialize(): Dr{
    return {
        id: "",
        name: "",
        department: "",
    }
}