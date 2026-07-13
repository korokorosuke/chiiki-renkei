import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const masterSchema = z.object({
    id: z.string()
        .min(1, "ＩＤを入力してください。")
        .max(10, "ＩＤは１０文字までです."),
    value: z.array(z.string()
        .min(1, "名称を入力してください。")
        .max(20, "名称は２０文字までです.")),
}).required({
    id: true
});

export type Master = z.infer<typeof masterSchema>;

export const validate = validater<Master>(masterSchema);

export function initialize(): Master {
    return {
        id: "",
        value: [],
    };
}