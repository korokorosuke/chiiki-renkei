import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const reservSchema = z.object({
    time: z.iso.time("予約時間が不正です。")
        .min(1, "予約時間を入力してください。"),
    max: z.number().min(0, "予約枠数は０以上です。"),
}).required({
    time: true, max: true
});

export const webMasterSchema = z.object({
    dept: z.string()
        .min(1, "科を入力してください。")
        .max(10, "科は１０文字までです。"),
    dr: z.string()
        .min(1, "予約医師を入力してください。")
        .max(10, "予約医師は１０文字までです。"),
    week: z.number().min(0, "曜日が不正です").max(6, "曜日が不正です"),
    reservs: z.array(reservSchema),
}).required({
    dept: true, dr: true, week: true, reservs: true
});

export type Reserv = z.infer<typeof reservSchema>;
export type WebMaster = z.infer<typeof webMasterSchema>;

export const validate = validater<WebMaster>(webMasterSchema);

export function initialize(): WebMaster{
    return {
        dept: "",
        dr: "",
        week: 1,
        reservs: []
    }
}

export function initializeReserv(): Reserv{
    return {
        time: "",
        max: 0,
    }
}