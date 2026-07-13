import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const webReservationSchema = z.object({
    dept: z.string()
        .min(1, "科を入力してください。")
        .max(10, "科は１０文字までです。"),
    dr: z.string()
        .min(1, "予約医師を入力してください。")
        .max(10, "予約医師は１０文字までです。"),
    date: z.iso.date("予約日が不正です。")
        .min(1, "予約日を入力してください。"),
    time: z.iso.time("予約時間が不正です。")
        .min(1, "予約時間を入力してください。"),
    max: z.number().min(0, "予約枠数は０以上です。"),
    cnt: z.number().min(0, "予約数は０以上です。"),
}).required({
    dept: true, dr: true, date: true, time: true, max: true, cnt: true
});

export type WebReservation = z.infer<typeof webReservationSchema>;

export const validate = validater<WebReservation>(webReservationSchema);

export function initialize(): WebReservation{
    return {
        dept: "",
        dr: "",
        date: "",
        time: "",
        max: 0,
        cnt: 0
    }
}