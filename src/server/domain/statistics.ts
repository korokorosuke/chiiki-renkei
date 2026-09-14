import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const conditionSchema = z.object({
  fromDate: z.iso.date("日付開始を不正です。").min(1, "日付開始を入力してください。"),
  toDate: z.iso.date("日付終了が不正です。").optional(),
  facility: z.string("施設IDが不正です。").max(20, "施設IDは20文字までです。").optional(),
  dept: z.string("診療科が不正です。").max(10).optional(),
  dr: z.string("医師が不正です。").max(10).optional(),
});

export type Condition = z.infer<typeof conditionSchema>;

export const validate = validater<Condition>(conditionSchema);

export function initialize(): Condition {
  return {
    fromDate: "",
    toDate: "",
    facility: "",
    dept: "",
    dr: "",
  }
}