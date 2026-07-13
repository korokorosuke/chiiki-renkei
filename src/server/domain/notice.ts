import { validater } from "../lib/validation.ts"
import { toDateString } from "../lib/datetime.ts"
import { z } from "zod"

export const NOTICE_TYPES = ["通常", "重要"];

export const noticeSchema = z.object({
    id: z.string(),
    type: z.enum(["", ...NOTICE_TYPES]),
    message: z.string()
        .min(1, {message: "メッセージを入力してください。"})
        .max(1000, {message: "メッセージは１０００文字までです。"}),
    fromDate: z.iso.date("開始日が不正です。")
        .min(1, {message: "開始日を入力してください。"}),
    toDate: z.iso.date("終了日が不正です。")
        .min(1, {message: "終了日を入力してください。"}),
}).required({
    id: true, type: true, message: true, fromDate: true, toDate: true,
})
.refine((val) => {
    return val.fromDate && val.toDate && new Date(val.fromDate) <= new Date(val.toDate);
}, "終了日は開始日以降にしてください。")
.refine((val) => {
    return val.type && NOTICE_TYPES.includes(val.type);
}, "お知らせの種類が不正です。");


export type Notice = z.infer<typeof noticeSchema>;

export const validate = validater<Notice>(noticeSchema);

export function initialize(): Notice {
    return {
        id: "",
        type: NOTICE_TYPES[0],
        message: "",
        fromDate: toDateString(new Date()),
        toDate: toDateString(new Date())
    }
}