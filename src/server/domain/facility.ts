import { validater } from "../lib/validation.ts"
import { userBaseSchema, initializeUser } from "./user.ts"
import { addressBaseSchema, initialize as initializeAddress } from "./address.ts"
import { z } from "zod"

export const contactSchema = z.object({
    tel: z.union([z.literal(""),
        z.string().max(13, "ＴＥＬが不正です。")
        .regex(/^[0-9]+-?[0-9]+-?[0-9]+$/, "ＴＥＬが不正です。")]),
    fax: z.union([z.literal(""),
        z.string().max(13, "ＴＥＬが不正です。")
        .regex(/^[0-9]+-?[0-9]+-?[0-9]+$/, "ＦＡＸが不正です。")]),
    email: z.union([z.literal(""),
        z.email("ＥＭＡＩＬが不正です.")]),
    name: z.string("名前を入力してください。")
        .min(1, "名前を入力してください。")
        .max(20, "名前は２０文字までです。"),
}).required({
    name: true
});

export type Contact = z.infer<typeof contactSchema>;

export const facilitySchema = z.object({
    id: z.string("ＩＤを入力してください。")
        .min(1, "ＩＤを入力してください。")
        .max(20, "ＩＤは２０文字までです。")
        .regex(/^[0-9a-zA-Z\-]+$/, "ＩＤは、英数字とハイフンしか使えません。"),
    attribute: z.string(),
    nameCorp: z.string(),
    name: z.string("名前を入力してください。")
        .min(1, "名前を入力してください。")
        .max(100, "名前は１００文字までです。"),
    kana: z.string().max(100, "かなは１００文字までです。"),
    tel: z.union([z.literal(""),
        z.string().max(13, "ＴＥＬが不正です。")
        .regex(/^[0-9]+-?[0-9]+-?[0-9]+$/, "ＴＥＬが不正です。")]),
    fax: z.union([z.literal(""),
        z.string().max(13, "ＴＥＬが不正です。")
        .regex(/^[0-9]+-?[0-9]+-?[0-9]+$/, "ＦＡＸが不正です。")]),
    email: z.union([z.literal(""),
        z.email("ＥＭＡＩＬが不正です.")]),
    contacts: z.array(contactSchema),
    address: addressBaseSchema,
    memo: z.string(),
    closedDate: z.union([z.literal(""), z.iso.date("閉院日が不正です。")]),
    createdBy: userBaseSchema,
    createdAt: z.string(),
    updatedBy: userBaseSchema,
    updatedAt: z.string(),
}).required({
    id: true, name: true
});

export type Facility = z.infer<typeof facilitySchema>;

export const validate = validater<Facility>(facilitySchema);

export interface Condition {
    name: string,
}

export const facBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    tel: z.string(),
    fax: z.string(),
    address: z.string(),
});

export const facSchema = facBaseSchema.extend({
    id: z.string("ＩＤを入力してください。")
        .min(1, "ＩＤを入力してください。")
        .max(20, "ＩＤは２０文字までです。"),
    name: z.string("名前を入力してください。")
        .min(1, "名前を入力してください。")
        .max(100, "名前は１００文字までです。"),
    tel: z.union([z.literal(""),
        z.string().max(13, "ＴＥＬが不正です。")
        .regex(/^[0-9]+-?[0-9]+-?[0-9]+$/, "ＴＥＬが不正です。")]),
    fax: z.union([z.literal(""),
        z.string().max(13, "ＴＥＬが不正です。")
        .regex(/^[0-9]+-?[0-9]+-?[0-9]+$/, "ＦＡＸが不正です。")]),
    address: z.string().max(100, "住所は１００文字までです。"),
}).required({
    id: true, name: true
});

export type Fac = z.infer<typeof facSchema>;

export const validateFac = validater<Fac>(facSchema);

export function initializeFac(): Fac {
    return {
        id: "",
        name: "",
        tel: "",
        fax: "",
        address: ""
    }
}

export function toFac(val: Facility): Fac{
    return {
        id: val.id,
        name: val.name,
        tel: val.tel,
        fax: val.fax,
        address: val.address.name + val.address.plus
    };
}

export function initialize(): Facility{
    return {
        id: "",
        attribute: "",
        nameCorp: "",
        name: "",
        kana: "",
        tel: "",
        fax: "",
        email: "",
        contacts: [],
        address: initializeAddress(),
        memo: "",
        closedDate: "",
        createdBy: initializeUser(),
        createdAt: "",
        updatedBy: initializeUser(),
        updatedAt: "",
    };
}

export function initializeContact(): Contact{
    return {
        tel: "",
        fax: "",
        email: "",
        name: ""
    };
}