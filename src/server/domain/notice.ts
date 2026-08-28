import { validater } from "../lib/validation.ts"
import { toDateString } from "../lib/datetime.ts"
import { z } from "zod"

export const NOTICE_PAGES = ["ログイン", "メニュー"];
export type NOTICE_PAGE = typeof NOTICE_PAGES[number];

export const noticeSchema = z.object({
    id: z.string(),
    page: z.enum(["", ...NOTICE_PAGES]),
    message: z.string()
        .min(1, {message: "メッセージを入力してください。"})
        .max(1000, {message: "メッセージは１０００文字までです。"}),
    fromDate: z.iso.date("開始日が不正です。")
        .min(1, {message: "開始日を入力してください。"}),
    toDate: z.iso.date("終了日が不正です。")
        .min(1, {message: "終了日を入力してください。"}),
    importance: z.boolean(),
}).required({
    id: true, page: true, message: true, fromDate: true, toDate: true,
})
.refine((val) => {
    return val.fromDate && val.toDate && new Date(val.fromDate) <= new Date(val.toDate);
}, "終了日は開始日以降にしてください。")
.refine((val) => {
    return val.page && NOTICE_PAGES.includes(val.page);
}, "お知らせの種類が不正です。");


export type Notice = z.infer<typeof noticeSchema>;

export const validate = validater<Notice>(noticeSchema);

export function initialize(): Notice {
    return {
        id: "",
        page: NOTICE_PAGES[0],
        message: "",
        fromDate: toDateString(new Date()),
        toDate: toDateString(new Date()),
        importance: false,
    }
}