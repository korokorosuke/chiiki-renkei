import { type User, userBaseSchema, initializeUser } from "./user.ts"
import { deptBaseSchema, initializeDept } from "./department.ts"
import { drBaseSchema, initialize as initializeDr } from "./dr.ts"
import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const replySchema = z.object({
    id: z.string(),
    refId: z.string(),
    date: z.iso.date("返事日が不正です。")
        .min(1, "返事日を入力してください。"),
    department: deptBaseSchema.refine((val) => val && val.id && val.name, "診療科を入力してください。"),
    dr: drBaseSchema.refine((val) => val && val.id && val.name, "医師を入力してください。"),
    classification: z.string(),
    personInCharge: userBaseSchema.refine((val: User) => val && val.id && val.name, "担当者を入力してください。"),
    memo: z.string()
        .max(1000, "備考は、１０００文字までです。"),
    updatedBy: userBaseSchema,
    updatedAt: z.string(),
}).required({
    id: true, date: true, dr: true, department: true, personInCharge: true,
});

export type Reply = z.infer<typeof replySchema>;

export const validate = validater<Reply>(replySchema);

export interface Condition {
    patientId?: string
    fromDate?: string
    toDate?: string
}

export function initialize(): Reply{
    return {
        id:"",
        refId: "",
        date: "",
        department: initializeDept(),
        dr: initializeDr(),
        classification: "",
        personInCharge: initializeUser(),
        memo: "",
        updatedBy: initializeUser(),
        updatedAt: "",
    };
}