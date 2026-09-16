import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const BASE_COLORS = ["neutral.800", "red.600", "amber.600", "green.600", "blue.600", "violet.600", "fuchsia.600"];

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
    color: BASE_COLORS[0],
  }
}