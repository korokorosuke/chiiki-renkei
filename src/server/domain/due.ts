import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const dueSchema = z.object({
    id: z.number()
        .min(0, "ＩＤは０から１０００００までです。")
        .max(100000, "ＩＤは０から１０００００までです。"),
    name: z.string()
        .min(1, "名前を入力してください。")
        .max(100, "名前は１００文字までです。"),
    days: z.number()
        .min(-1, "日数は０から１０００００までです。")
        .max(100000, "日数は０から１０００００までです。"),
}).required({
    id: true, name: true, days: true
});

export type Due = z.infer<typeof dueSchema>;

export const validate = validater<Due>(dueSchema);

export function initialize(): Due{
    return {
        id: -1,
        name: "",
        days: -1
    };
}