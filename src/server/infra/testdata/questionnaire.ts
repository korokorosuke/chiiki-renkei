import { expect } from "vitest"
import type { IQuestionnaireRepository } from "../../domain/questionnaireService.ts"
import type { Questionnaire } from "../../domain/questionnaire.ts"

export const questionnaire: Questionnaire = {
  id: "1",
  title: "アンケートタイトル",
  description: "アンケートの説明文",
  depts: ["01"],
  items: [{
    id: "q1",
    type: "choice",
    require: true,
    question: "質問１",
    choices: [{
      id: "c1",
      text: "選択肢１",
    },{
      id: "c2",
      text: "選択肢２",
    },{
      id: "c3",
      text: "選択肢３",
    }],
  },{
    id: "q2",
    type: "choice",
    require: true,
    question: "質問２",
    choices: [{
      id: "c1",
      text: "選択肢１",
    },{
      id: "c2",
      text: "選択肢２",
    },{
      id: "c3",
      text: "選択肢３",
    }],
  }, {
    id: "q3",
    type: "choice",
    require: true,
    question: "質問３",
    choices: [{
      id: "c1",
      text: "選択肢１",
    },{
      id: "c2",
      text: "選択肢２",
    },{
      id: "c3",
      text: "選択肢３",
    }],
  }, {
    id: "q4",
    type: "text",
    require: true,
    question: "質問４",
    choices: undefined,
    condition: {
      q: "q3",
      a: "c1",
    }
  }, {
    id: "q5",
    type: "text",
    require: true,
    question: "質問５",
    choices: undefined,
  },
  ]
}

export const questionnaire2: Questionnaire = {
  id: "2",
  title: "アンケートタイトル",
  description: "アンケートの説明文",
  depts: ["01"],
  items: [{
    id: "q1",
    type: "choice",
    require: true,
    question: "質問１",
    choices: [{
      id: "c1",
      text: "選択肢１",
    }],
  }]
}

export const questionnaire3: Questionnaire = {
  id: "1",
  title: "アンケートタイトル３",
  description: "アンケートの説明文３",
  depts: ["01"],
  items: [{
    id: "q1",
    type: "choice",
    require: true,
    question: "質問１",
    choices: [{
      id: "c1",
      text: "選択肢１",
    },{
      id: "c2",
      text: "選択肢２",
    },{
      id: "c3",
      text: "選択肢３",
    }],
  }, {
    id: "q2",
    type: "choice",
    require: true,
    question: "質問２",
    choices: [{
      id: "c1",
      text: "選択肢１",
    },{
      id: "c2",
      text: "選択肢２",
    },{
      id: "c3",
      text: "選択肢３",
    }],
  }, {
    id: "q3",
    type: "choice",
    require: true,
    question: "質問３",
    choices: [{
      id: "c1",
      text: "選択肢１",
    },{
      id: "c2",
      text: "選択肢２",
    },{
      id: "c3",
      text: "選択肢３",
    }],
  }, {
    id: "q4",
    type: "text",
    require: true,
    question: "質問４",
    choices: [],
    condition: {
      q: "q3",
      a: "c3",
    }
  }, {
    id: "q5",
    type: "text",
    require: true,
    question: "質問５",
    choices: [],
  }]
}

export const questionnaire4: Questionnaire = {
  id: "2",
  title: "アンケートタイトル",
  description: "アンケートの説明文",
  depts: ["01"],
  items: [{
    id: "q1",
    type: "choice",
    require: true,
    question: "質問１",
    choices: [{
      id: "c1",
      text: "選択肢１",
    }],
  }]
}

export const questionnaire5: Questionnaire = {
  id: "5",
  title: "アンケートタイトル",
  description: "アンケートの説明文",
  depts: ["02"],
  items: [{
    id: "q1",
    type: "choice",
    require: true,
    question: "質問１",
    choices: [{
      id: "c1",
      text: "選択肢１",
    }],
  }]
}

export async function insert(repo: IQuestionnaireRepository){
  let res = await repo.insert(questionnaire);
  expect(res).toBe(true);
  res = await repo.insert(questionnaire2);
  expect(res).toBe(true);
}
export async function update(repo: IQuestionnaireRepository){
  const res = await repo.update(questionnaire3);
  expect(res).toBe(true);
}
export async function read(repo: IQuestionnaireRepository){
  let res = await repo.read(questionnaire.id);
  expect(questionnaire3).toEqual(res);
  res = await repo.read(questionnaire2.id);
  expect(questionnaire2).toEqual(res);
}
export async function list(repo: IQuestionnaireRepository){
  const res = await repo.list();
  expect(res.length).toBe(2);
}
export async function del(repo: IQuestionnaireRepository){
  await repo.delete(questionnaire);
  let res = await repo.read(questionnaire.id);
  expect(res).toBeUndefined();
  await repo.delete(questionnaire2);
  res = await repo.read(questionnaire2.id);
  expect(res).toBeUndefined();
}