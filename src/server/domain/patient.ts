import { validater } from "../lib/validation.ts"
import { addressBaseSchema, initialize as initializeAddress } from "./address.ts"
import { z } from "zod"

export const patientBaseSchema = z.object({
    id: z.string(),
    lastName: z.string(),
    firstName: z.string(),
    lastKana: z.string(),
    firstKana: z.string(),
    sex: z.number(),
    birthday: z.string(),
    tel: z.string(),
    tel2: z.string(),
    address: addressBaseSchema,
    memo: z.string(),
});

export const patientSchema = z.object({
    id: z.string()
        .min(1, "ＩＤを入力してください。")
        .max(10, "ＩＤは１０文字までです。"),
    lastName: z.string()
        .min(1, "姓を入力してください。")
        .max(50, "姓は５０文字までです。"),
    firstName: z.string()
        .min(1, "名を入力してください。")
        .max(50, "名は５０文字までです。"),
    lastKana: z.string()
        .max(50, "セイは５０文字までです。"),
    firstKana: z.string()
        .max(50, "メイは５０文字までです。"),
    sex: z.number().min(0, "性別が不正です。").max(1, "性別が不正です。"),
    birthday: z.union([z.literal(""),
        z.iso.date("誕生日が不正です。")]),
    tel: z.union([z.literal(""),
        z.string().max(13, "ＴＥＬが不正です。")
        .regex(/^[0-9]+-?[0-9]+-?[0-9]+$/, "ＴＥＬが不正です。")]),
    tel2: z.union([z.literal(""),
        z.string().max(13, "ＴＥＬが不正です。")
        .regex(/^[0-9]+-?[0-9]+-?[0-9]+$/, "ＴＥＬ２が不正です。")]),
    address: addressBaseSchema,
    memo: z.string(),
}).required({
    id: true, lastName: true, firstName: true,
});

export type Patient = z.infer<typeof patientSchema>;

export const validate = validater<Patient>(patientSchema);

export function initialize(): Patient {
    return {
        id: "",
        lastName: "",
        firstName: "",
        lastKana: "",
        firstKana: "",
        sex: 0,
        birthday: "",
        tel: "",
        tel2: "",
        address: initializeAddress(),
        memo: "",
    }
}

export interface Condition{
    name: string
}