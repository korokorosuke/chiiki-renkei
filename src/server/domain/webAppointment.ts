import { patientSchema, initialize as initializePatient } from "./patient.ts"
import { userBaseSchema, initializeUser } from "./user.ts"
import { facSchema, initializeFac } from "./facility.ts"
import { webDrBaseSchema, initialize as initializeWebDr } from "./webDr.ts"
import { type WebDepartment, webDepartmentSchema, initialize as initializeWebDept } from "./webDepartment.ts"
import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const consultationSchema = z.object({
    first: z.string(),
    second: z.string(),
    etc: z.string()
});

const webPatientSchema = patientSchema.extend({
    id: z.string(),
    lastKana: z.string()
        .min(1, "セイを入力してください。")
        .max(50, "セイは５０文字までです。"),
    firstKana: z.string()
        .min(1, "メイを入力してください。")
        .max(50, "メイは５０文字までです。"),
});

export const webAppointmentSchema = z.object({
    id: z.string(),
    date: z.union([z.literal(""),
        z.iso.date("予約日が不正です。")]),
    time: z.union([z.literal(""),
        z.iso.time("予約時間が不正です。")]),
    patient: webPatientSchema.refine((val) => val && val.lastName && val.firstName, "患者を入力してください。"),
    facility: facSchema.refine((val) => val && val.id && val.name, "施設を入力してください。"),
    department: webDepartmentSchema.refine((val: WebDepartment) => val && val.id && val.name, "診療科を入力してください。"),
    dr: webDrBaseSchema,
    facPatientId: z.string(),
    mainComplaint: z.string()
        .min(1, "主訴を入力してください。")
        .max(1000, "主訴は１０００文字までです。"),
    cancel: z.boolean(),
    consultation: consultationSchema.optional(),
    force: z.boolean().optional(),
    createdAt: z.string(),
    createdBy: userBaseSchema,
    updatedAt: z.string(),
    updatedBy: userBaseSchema,
}).required({
    id: true, date: true, time: true, patient: true, facility: true,
    department: true, dr: true, mainComplaint: true,
}).refine((val) => {
    if(!val.date && (!val.consultation ||
            (!val.consultation.first && !val.consultation.second && !val.consultation.etc))){
        return false;
    }
    return true;
}, "予約日を入力してください。")
.refine((val) => {
    if(val.date){
        if(!val.time){
            return false;
        }
        if(val.dr && !val.dr.id && !val.force){
            return false;
        }else if(val.dr && !val.dr.name){
            return false;
        }
    }
    return true;
}, "予約情報が不正です。")

export type WebAppointment = z.infer<typeof webAppointmentSchema>;
export type Consultation = z.infer<typeof consultationSchema>;

export const validate = validater<WebAppointment>(webAppointmentSchema);

export function initialize(): WebAppointment{
    return {
        id: "",
        date: "",
        time: "",
        patient: {
          ...initializePatient(),
          lastKana: "",
          firstKana: "",
        },
        facility: initializeFac(),
        department: initializeWebDept(),
        dr: initializeWebDr(),
        facPatientId: "",
        mainComplaint: "",
        consultation: undefined,
        cancel: false,
        force: false,
        createdAt: "",
        createdBy: initializeUser(),
        updatedAt: "",
        updatedBy: initializeUser()
    }
}

export interface Condition {
    patientId?: string
    facilityId?: string
    fromDate?: string
    toDate?: string
}