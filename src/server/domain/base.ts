import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const baseSchema = z.object({
  id: z.string()
    .min(1, "idがありません。")
    .max(20, "idが不正です。"),
  name: z.string()
    .min(1, "施設名がありません。")
    .max(100, "施設名が不正です。"),
  color: z.string(),
}).required({
  id: true,
  name: true,
  color: true,
});

export type Base = z.infer<typeof baseSchema>;

export const validate = validater<Base>(baseSchema);

export function initialize(): Base {
  return {
    id: "",
    name: "",
    color: "neutral.800"
  }
}