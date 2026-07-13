import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const deptBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const deptSchema = deptBaseSchema.extend({
    id: z.string("ＩＤを入力してください。")
        .min(1, "ＩＤを入力してください。")
        .max(10, "ＩＤは１０文字までです."),
    name: z.string()
        .min(1, "名前を入力してください。")
        .max(100, "名前は１００文字までです."),
}).required({
    id: true, name: true
});

export const departmentSchema = deptSchema.extend({
    exam: z.boolean(),
});

export type Dept = z.infer<typeof deptSchema>;
export type Department = z.infer<typeof departmentSchema>;

export const validate = validater<Department|Dept>(deptSchema);

export function initialize(): Department{
    return {
        id: "",
        name: "",
        exam: false,
    }
}

export function initializeDept(): Dept{
    return {
        id: "",
        name: "",
    }
}