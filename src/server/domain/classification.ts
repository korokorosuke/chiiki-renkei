import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const classSchema = z.object({
    id: z.string("ＩＤを入力してください。")
        .min(1, "ＩＤを入力してください。")
        .max(10, "ＩＤは１０文字までです."),
    name: z.string()
        .min(1, "名称を入力してください。")
        .max(100, "名称は１００文字までです."),
    done: z.boolean(),
}).required({
    id: true, name: true, done: true
});

export type Classification = z.infer<typeof classSchema>;

export const validate = validater<Classification>(classSchema);

export function initialize(): Classification{
    return {
        id: "",
        name: "",
        done: false,
    }
}