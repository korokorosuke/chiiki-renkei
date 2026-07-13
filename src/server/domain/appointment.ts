import { type User, userBaseSchema, initializeUser } from "./user.ts"
import { type Fac, facBaseSchema, initializeFac } from "./facility.ts"
import { type Dept, deptBaseSchema, initializeDept } from "./department.ts"
import { type Dr, drBaseSchema, initialize as initializeDr } from "./dr.ts"
import { type Patient, patientSchema, initialize as initializePatient } from "./patient.ts"
import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const appointmentSchema = z.object({
    id: z.string(),
    patient: patientSchema.refine((val: Patient) => val && val.id, "患者を入力してください。"),
    date: z.iso.date("予約日が不正です。")
        .min(1, "予約日を入力してください。"),
    time: z.union([z.literal(""), z.iso.time("予約時間が不正です。")]),
    facility: facBaseSchema.refine((val: Fac) => val && val.id && val.name, "施設を入力してください。"),
    facilityDr: z.string()
        .max(50, "施設医師は、５０文字までです。"),
    facilityDept: z.string()
        .max(30, "施設診療科は、３０文字までです。"),
    department: deptBaseSchema.refine((val: Dept) => val && val.id && val.name, "診療科を入力してください。"),
    dr: drBaseSchema.refine((val: Dr) => val && val.id, "医師を入力してください。"),
    appDisplay: z.string()
        .max(50, "表示名は５０文字までです。"),
    means: z.string(),
    personInCharge: userBaseSchema.refine((val: User) => val && val.id && val.name, "担当者を入力してください。"),
    memo: z.string()
        .max(1000, "備考は、１０００文字までです。"),
    updatedBy: userBaseSchema,
    updatedAt: z.string(),
}).required({
    id: true, patient: true, date: true, facility: true,
    dr: true, department: true, personInCharge: true,
});

export type Appointment = z.infer<typeof appointmentSchema>;

export const validate = validater<Appointment>(appointmentSchema);

export function initialize(): Appointment{
    return {
        id: "",
        patient: initializePatient(),
        date: "",
        time: "",
        facility: initializeFac(),
        facilityDr: "",
        facilityDept: "",
        department: initializeDept(),
        dr: initializeDr(),
        appDisplay: "",
        means: "",
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