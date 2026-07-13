import { type ValidationResult } from "../lib/validation.ts"
import { userBaseSchema, initializeUser } from "./user.ts"
import { type Fac, facBaseSchema, initializeFac } from "./facility.ts"
import { z } from "zod"

const activitySchema = z.object({
    id: z.string("ＩＤを入力してください。"),
    date: z.iso.datetime({local: true, message: "実施日時が不正です。"})
        .min(1, "実施日時を入力してください。"),
    toDate: z.union([z.literal(""),
        z.iso.datetime("実施日時が不正です。")]),
    participants: z.string()
        .min(1, "参加者を入力してください。")
        .max(100, "参加者は、１００文字までです。"),
    facilityParticipants: z.string()
        .min(1, "施設参加者を入力してください。")
        .max(100, "施設参加者は、１００文字までです。"),
    details: z.string()
        .min(1, "内容を入力してください。")
        .max(1000, "内容は、１０００文字までです。"),
    purpose: z.array(z.string()),
    facility: facBaseSchema.refine((val: Fac) => val && val.id && val.name, "施設を入力してください。"),
    updatedBy: userBaseSchema,
    updatedAt: z.string(),
}).required({
    id: true, date: true, participants: true, facilityParticipants: true,
    details: true, purpose: true, facility: true,
});

export type Activity = z.infer<typeof activitySchema>;

export function validate(act: Activity): ValidationResult{
    const valid = activitySchema.safeParse(act);
    if(valid.success){
        return {ok: true, errors: []};
    }else{
        return {ok: false, errors: valid.error.issues.map(res=>res.message)};
    }
}

export function initialize(): Activity {
    return {
        id: "",
        date: "",
        toDate: "",
        participants: "",
        facilityParticipants: "",
        details: "",
        purpose: [],
        facility: initializeFac(),
        updatedBy: initializeUser(),
        updatedAt: "",
    }
}

export interface Condition {
    facilityId?: string
    fromDate?: string
    toDate?: string
}