import { validater } from "../lib/validation.ts"
import { type User, userBaseSchema, initializeUser } from "./user.ts"
import { type Patient, patientBaseSchema, initialize as initializePatient } from "./patient.ts"
import { facBaseSchema, initializeFac } from "./facility.ts"
import { dueSchema, initialize as initializeDue } from "./due.ts"
import { z } from "zod"

export const responseSchema = z.object({
    responder: userBaseSchema.refine((val: User) => val && val.id, "担当者を入力してください。"),
    datetime: z.iso.datetime({local: true, message: "対応日時が不正です。"})
        .min(1, "対応日時を入力してください。"),
    details: z.string()
        .min(1, "対応内容を入力してください。")
        .max(1000, "対応内容は１０００文字までです。")
}).required({
    responder: true, datetime: true, details: true
});

export const inquirySchema = z.object({
    id: z.string(),
    patient: patientBaseSchema.refine((val: Patient) =>  val && val.id, "患者を入力してください。"),
    facility: facBaseSchema.refine((val) => val && val.name, "問合せ施設を入力してください。"),
    facilityStaff: z.string()
        .max(50, "問合せ者は５０文字までです。"),
    personInCharge: userBaseSchema.refine((val: User) => val && val.id && val.name, "担当者を入力してください。"),
    tel: z.string()
        .max(50, "連絡先は５０文字までです。"),
    datetime: z.iso.datetime({local: true, message: "問合せ日時が不正です。"})
        .min(1, "問合せ日時を入力してください。"),
    due: dueSchema,
    details: z.string()
        .min(1, "問合せ内容を入力してください。")
        .max(1000, "問合せ内容は１０００文字までです。"),
    done: z.boolean(),
    responses: z.array(responseSchema),
}).required({
    id: true, patient: true, facility: true, personInCharge: true,
    datetime: true, details: true
});

export type Inquiry = z.infer<typeof inquirySchema>;
export type Response = z.infer<typeof responseSchema>;

export const validate = validater<Inquiry>(inquirySchema);
export const validateResponse = validater<Response>(responseSchema);

export function initialize(): Inquiry{
    return {
        id: "",
        patient: initializePatient(),
        facility: initializeFac(),
        facilityStaff: "",
        personInCharge: initializeUser(),
        tel: "",
        datetime: "",
        due: initializeDue(),
        details: "",
        done: false,
        responses: [],
    };
}

export interface Condition{
    patientId?: string
    fromDate?: string
    toDate?: string
    facilityId?: string
}