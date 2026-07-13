import { type User, userBaseSchema, initializeUser } from "./user.ts"
import { facBaseSchema, initializeFac } from "./facility.ts"
import { deptBaseSchema, initializeDept } from "./department.ts"
import { drBaseSchema, initialize as initializeDr } from "./dr.ts"
import { patientSchema, initialize as initializePatient } from "./patient.ts"
import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const referralToSchema = z.object({
    id: z.string(),
    patient: patientSchema.refine((val) => val && val.id, "患者を入力してください。"),
    date: z.iso.date("紹介日が不正です。")
        .min(1, "紹介日を入力してください。"),
    facility: facBaseSchema.refine((val) => val && val.id && val.name, "施設を入力してください。"),
    facilityDr: z.string()
        .max(50, "施設医師は、５０文字までです。"),
    facilityDept: z.string()
        .max(30, "施設診療科は、３０文字までです。"),
    department: deptBaseSchema.refine((val) => val && val.id && val.name, "診療科を入力してください。"),
    dr: drBaseSchema.refine((val) => val && val.id && val.name, "医師を入力してください。"),
    personInCharge: userBaseSchema.refine((val: User) => val && val.id && val.name, "担当者を入力してください。"),
    memo: z.string()
        .max(1000, "備考は、１０００文字までです。"),
    updatedBy: userBaseSchema,
    updatedAt: z.string(),
}).required({
    id: true, patient: true, date: true, facility: true,
    dr: true, department: true, personInCharge: true,
});

export type ReferralTo = z.infer<typeof referralToSchema>;

export const validate = validater<ReferralTo>(referralToSchema);

export function initialize(): ReferralTo{
    return {
        id: "",
        patient: initializePatient(),
        date: "",
        facility: initializeFac(),
        facilityDr: "",
        facilityDept: "",
        department: initializeDept(),
        dr: initializeDr(),
        personInCharge: initializeUser(),
        memo: "",
        updatedBy: initializeUser(),
        updatedAt: "",
    };
}

export interface Condition {
    patientId?: string
    fromDate?: string
    toDate?: string
}