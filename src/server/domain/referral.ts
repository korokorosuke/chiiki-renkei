import { replySchema } from "./reply.ts"
import { facBaseSchema, initializeFac } from "./facility.ts"
import { deptBaseSchema, initializeDept } from "./department.ts"
import { drBaseSchema, initialize as initializeDr } from "./dr.ts"
import { patientSchema, initialize as initializePatient } from "./patient.ts"
import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const referralSchema = z.object({
    id: z.string(),
    patient: patientSchema.refine((val) => val && val.id, "患者を入力してください。"),
    date: z.iso.date("紹介日が不正です。")
        .min(1, "紹介日を入力してください。"),
    facility: facBaseSchema.refine((val) => val && val.id && val.name, "施設を入力してください。"),
    department: deptBaseSchema.refine((val) => val && val.id && val.name, "診療科を入力してください。"),
    dr: drBaseSchema.refine((val) => val && val.id && val.name, "医師を入力してください。"),
    replies: z.array(replySchema),
}).required({
    id: true, patient: true, date: true, facility: true,
    dr: true, department: true
});

export type Referral = z.infer<typeof referralSchema>;

export const validate = validater<Referral>(referralSchema);

export function initialize(): Referral{
    return {
        id: "",
        patient: initializePatient(),
        date: "",
        facility: initializeFac(),
        department: initializeDept(),
        dr: initializeDr(),
        replies: [],
    };
}

export interface Condition {
    patientId?: string
    fromDate?: string
    toDate?: string
}