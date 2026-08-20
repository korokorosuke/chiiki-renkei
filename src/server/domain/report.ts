import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const conditionSchema = z.object({
  date: z.iso.date("対象日が不正です。")
    .min(1, "対象日を入力してください。"),
  facilityId: z.string().optional(),
  deptId: z.string().optional(),
}).required({
  date: true
});

export type Condition = z.infer<typeof conditionSchema>;

export const validate = validater<Condition>(conditionSchema);

export function initialize(): Condition {
  return {
    date: "",
    facilityId: "",
    deptId: "",
  }
}