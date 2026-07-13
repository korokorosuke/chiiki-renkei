import { validater } from "../lib/validation.ts"
import { z } from "zod"
import { questionnaireSchema, initialize as initializeQuestionnaire } from "./questionnaire.ts"

export const MAX_CHECK_COUNT = 10;

export const answerSchema = z.object({
    id: z.string(),
    questionnaire: questionnaireSchema,
    appointmentId: z.uuidv7("予約IDの形式が不正です"),
    appointmentDate: z.iso.date("予約日付の形式が不正です").optional(),
    inputDate: z.iso.datetime({local: true}).optional(),
    items: z.array(z.string()),
});

export const answerPasswordSchema = z.object({
    appointmentId: z.string(),
    password: z.string(),
    failCount: z.number(),
});

export type Answer = z.infer<typeof answerSchema>;
export type AnswerPassword = z.infer<typeof answerPasswordSchema>;

export const validate = validater<Answer>(answerSchema);
export const validatePassword = validater<AnswerPassword>(answerPasswordSchema);

export function initialize(): Answer{
    return {
        id: "",
        questionnaire: initializeQuestionnaire(),
        appointmentId: "",
        appointmentDate: undefined,
        inputDate: undefined,
        items: [],
    }
}

export function initializePassword(): AnswerPassword{
    return {
        appointmentId: "",
        password: "",
        failCount: 0,
    }
}