import { validater } from "../lib/validation.ts"
import { userBaseSchema, initializeUser } from "./user.ts"
import { z } from "zod"

export const Staff = z.object({
    id: z.string(),
    name: z.string().max(100, "名前は１００文字までです。"),
    kana: z.string().max(100, "フリガナは１００文字までです。"),
    department: z.string().max(30, "部署は３０文字までです。"),
    dr: z.boolean(),
    post: z.string(),
    facilityId: z.string()
        .min(1, "施設IDを入力してください。")
        .max(20, "施設IDは２０文字までです。"),
    sort: z.number(),
    hidden: z.boolean(),
    updatedBy: userBaseSchema,
    updatedAt: z.string(),
}).required({
    id: true,
});

export type Staff = z.infer<typeof Staff>;

export const validate = validater<Staff>(Staff);

export function initialize(): Staff{
    return {
        id: "",
        name: "",
        kana: "",
        department: "",
        dr: true,
        post: "",
        facilityId: "",
        sort: 0,
        hidden: false,
        updatedBy: initializeUser(),
        updatedAt: ""
    };
}

export interface Condition{
    dr: boolean
    hidden: boolean
    facilityid: string
}