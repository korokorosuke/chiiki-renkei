import { validater } from "../lib/validation.ts"
import { z } from "zod"

export const questionTypes = { text: "フリー入力", choice: "単一選択", multiple: "複数選択" } as const;
export const QUESTION_TYPES = Object.keys(questionTypes);
export type QuestionType = "text"|"choice"|"multiple";

export const conditionSchema = z.object({
    q: z.string(),
    a: z.string(),
});

export const questionSchema = z.object({
    id: z.string(),
    type: z.enum(QUESTION_TYPES),
    require: z.boolean(),
    question: z.string()
        .min(1, "質問を入力してください。")
        .max(200, "質問は２００文字までです。"),
    choices: z.array(z.object({
        id: z.string(),
        text: z.string()
            .min(1, "選択肢の内容を入力してください。")
            .max(100, "選択肢の内容は１００文字までです。"),
    })).optional(),
    condition: conditionSchema.optional(),
}).refine((data) => {
    if(data.type === "choice" || data.type === "multiple"){
        return data.choices && data.choices.length > 0;
    }
    return true;
});

export const questionnaireSchema = z.object({
    id: z.string(),
    title: z.string()
        .min(1, "タイトルを入力してください。")
        .max(100, "タイトルは１００文字までです。"),
    description: z.string()
        .max(1000, "説明は１０００文字までです。"),
    depts: z.array(z.string()),
    items: z.array(questionSchema),
});


export type Questionnaire = z.infer<typeof questionnaireSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Condition = z.infer<typeof conditionSchema>;

export const validate = validater<Questionnaire>(questionnaireSchema);

export function initialize(): Questionnaire{
    return {
        id: "",
        title: "",
        description: "",
        depts: [],
        items: [],
    }
}

export function initializeQuestion(): Question{
    return {
        id: "",
        type: QUESTION_TYPES[0],
        require: true,
        question: "",
        choices: [],
        condition: undefined,
    }
}