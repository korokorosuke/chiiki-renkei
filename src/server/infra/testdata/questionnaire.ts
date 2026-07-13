import { assert, assertFalse, fail } from "@std/assert"
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
    choices: undefined,
    condition: {
      q: "q3",
      a: "c3",
    }
  }, {
    id: "q5",
    type: "text",
    require: true,
    question: "質問５",
    choices: undefined,
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

function compare(q1: Questionnaire, q2: Questionnaire): boolean {
  if(q1.title !== q2.title){
    return false;
  }
  if(q1.description !== q2.description){
    return false;
  }
  if(q1.items.length !== q2.items.length){
    return false;
  }
  for(let i=0; i<q1.items.length; i++){
    const item1 = q1.items[i];
    const item2 = q2.items[i];
    if(item1.id !== item2.id){
      return false;
    }
    if(item1.question !== item2.question){
      return false;
    }
    const len1 = item1.choices === undefined ? 0 : item1.choices.length;
    const len2 = item2.choices === undefined ? 0 : item2.choices.length;
    if(len1 !== len2){
      return false;
    }
    if(item1.choices){
      for(let j=0; j<item1.choices.length; j++){
        const choice1 = item1.choices[j];
        const choice2 = item2.choices?.[j];
        if(choice1.id !== choice2?.id){
          return false;
        }
        if(choice1.text !== choice2?.text){
          return false;
        }
      }
    }
  }
  return true;
}

export async function insert(repo: IQuestionnaireRepository){
  let res = await repo.insert(questionnaire);
  assert(res);
  res = await repo.insert(questionnaire2);
  assert(res);
}
export async function update(repo: IQuestionnaireRepository){
  const res = await repo.update(questionnaire3);
  assert(res);
}
export async function read(repo: IQuestionnaireRepository){
  let res = await repo.read(questionnaire.id);
  if(res){
    assert(compare(questionnaire3, res));
  }else{
    fail();
  }
  res = await repo.read(questionnaire2.id);
  if(res){
    assert(compare(questionnaire2, res));
  }else{
    fail();
  }
}
export async function list(repo: IQuestionnaireRepository){
  const res = await repo.list();
  assert(res.length == 2);
}
export async function del(repo: IQuestionnaireRepository){
  await repo.delete(questionnaire);
  let res = await repo.read(questionnaire.id);
  assertFalse(res);
  await repo.delete(questionnaire2);
  res = await repo.read(questionnaire2.id);
  assertFalse(res);
}