import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const userBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    department: z.string(),
});

export const userSchema = userBaseSchema.extend({
    id: z.string("ＩＤを入力してください。")
        .min(1, "ＩＤを入力してください。")
        .max(50, "ＩＤは50文字までです。"),
    name: z.string("名前を入力してください。")
        .min(1, "名前を入力してください。")
        .max(100, "名前は100文字までです。"),
    department: z.string("診療科を入力してください。")
        .min(1, "診療科を入力してください。")
        .max(10, "診療科は10文字までです。"),
}).required({
    id: true, name: true, department: true
});

export type User = z.infer<typeof userSchema>;

export const authUserSchema = userSchema.extend({
    base: z.string(),
    authFacility: z.number(),
    authReferral: z.number(),
    authActivity: z.number(),
    authStatistics: z.number(),
    authMaster: z.number(),
    authWeb: z.number(),
    password: z.string().optional(),
    facilityId: z.string().optional(),
    locked: z.boolean().optional(),
    failCount: z.number().optional(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

export const validate = validater<AuthUser|User>(userSchema);

export function initializeUser(): User {
    return {
        id: "",
        name: "",
        department: ""
    }
}

export function initialize(): AuthUser{
    return {
        id: "",
        password: "",
        name: "",
        department: "",
        base: "",
        authFacility: 0,
        authReferral: 0,
        authActivity: 0,
        authStatistics: 0,
        authMaster: 0,
        authWeb: 0,
        facilityId: "",
    };
}

export interface Condition{
    name: string
}

export function toUser(val: AuthUser): User{
    return {
        id: val.id,
        name: val.name,
        department: val.department
    };
}