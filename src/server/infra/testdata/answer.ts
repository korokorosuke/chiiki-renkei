import { assert, assertFalse, fail } from "@std/assert"
import type { IAnswerRepository } from "../../domain/answerService.ts"
import type { IAppointmentRepository } from "../../domain/appointmentService.ts"
import type { IPatientRepository } from "../../domain/patientService.ts"
import type { IQuestionnaireRepository } from "../../domain/questionnaireService.ts"
import type { Answer } from "../../domain/answer.ts"
import { appointment, appointment6 } from "../../infra/testdata/appointment.ts"

export const answer: Answer = {
  id: "1",
  appointmentId: "019d617b-df2a-7114-a05c-6687bd38360e",
  appointmentDate: "2026-01-01",
  inputDate: undefined,
  questionnaire: {
    id: "00000000-0000-0000-0000-000000000001",
    depts: ["01"],
    title: "アンケートタイトル",
    description: "アンケート説明",
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
    },{
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
    },{
      id: "q4",
      type: "text",
      require: true,
      question: "質問４",
      choices: undefined,
      condition: {
        q: "q3",
        a: "c1",
      }
    },{
      id: "q5",
      type: "text",
      require: true,
      question: "質問５",
      choices: undefined,
    }],
  },
  items: ["","","","",""],
}

export const answer2: Answer = {
  id: "2",
  appointmentId: "019d617b-df2a-7114-a05c-6687bd38360e",
  appointmentDate: "2026-01-01",
  inputDate: "2026-03-18T10:30:00",
  questionnaire: {
    id: "00000000-0000-0000-0000-000000000002",
    depts: ["01"],
    title: "アンケートタイトル",
    description: "アンケート説明",
    items: [{
      id: "q1",
      type: "choice",
      require: true,
      question: "質問１",
      choices: [{
        id: "c1",
        text: "選択肢１",
      }],
    }],
  },
  items: ["c1"],
}

export const answer3: Answer = {
  id: "1",
  appointmentId: "019d617b-df2a-7114-a05c-6687bd38360e",
  appointmentDate: "2026-01-01",
  inputDate: "2026-03-18T12:30:00",
  questionnaire: {
    id: "00000000-0000-0000-0000-000000000001",
    depts: ["01"],
    title: "アンケートタイトル",
    description: "アンケート説明",
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
    },{
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
    },{
      id: "q4",
      type: "text",
      require: true,
      question: "質問４",
      choices: undefined,
      condition: {
        q: "q3",
        a: "c3",
      }
    },{
      id: "q5",
      type: "text",
      require: true,
      question: "質問５",
      choices: undefined,
    }],
  },
  items: ["c1", "c2", "c3", "こんにちは", "特になし"],
}

export const answer4: Answer = {
  id: "4",
  appointmentId: "019d617b-df2a-7114-a05c-6687bd38360f",
  appointmentDate: "2026-01-01",
  inputDate: "2026-03-18T10:30:00",
  questionnaire: {
    id: "00000000-0000-0000-0000-000000000002",
    depts: ["01"],
    title: "アンケートタイトル",
    description: "アンケート説明",
    items: [{
      id: "q1",
      type: "choice",
      require: true,
      question: "質問１",
      choices: [{
        id: "c1",
        text: "選択肢１",
      }],
    }],
  },
  items: ["c1"],
}

function compare(a1: Answer, a2: Answer): boolean {
  if(a1.questionnaire.id !== a2.questionnaire.id){
    console.log("id:", a1.questionnaire.id, a2.questionnaire.id);
    return false;
  }
  if(a1.appointmentId !== a2.appointmentId){
    console.log("appointmentId:", a1.appointmentId, a2.appointmentId);
    return false;
  }
  if(a1.inputDate !== a2.inputDate){
    console.log("inputDate:", a1.inputDate, a2.inputDate);
    return false;
  }
  if(a1.items.length !== a2.items.length){
    console.log("items.length:", a1.items.length, a2.items.length);
    return false;
  }
  for(let i=0; i<a1.questionnaire.items.length; i++){
    const q1 = a1.questionnaire.items[i];
    const q2 = a2.questionnaire.items[i];
    const item1 = a1.items[i];
    const item2 = a2.items[i];
    if(q1.id !== q2.id){
      console.log("q1.id:", q1.id, q2.id);
      return false;
    }
    if(q1.question !== q2.question){
      console.log("q1.question:", q1.question, q2.question);
      return false;
    }
    const len1 = q1.choices ? q1.choices.length : 0;
    const len2 = q2.choices ? q2.choices.length : 0;
    if(len1 !== len2){
      console.log("q1.choices.length:", q1.choices?.length, q2.choices?.length);
      return false;
    }
    if(q1.choices){
      for(let j=0; j<q1.choices.length; j++){
        const choice1 = q1.choices[j];
        const choice2 = q2.choices?.[j];
        if(choice1.id !== choice2?.id){
          console.log("choice1.id:", choice1.id, choice2?.id);
          return false;
        }
        if(choice1.text !== choice2?.text){
          console.log("choice1.text:", choice1.text, choice2?.text);
          return false;
        }
      }
    }
    if(item1 !== item2){
      console.log("item1:", item1, item2);
      return false;
    }
  }
  return true;
}

export async function prepare(repo: IAppointmentRepository, repoPat?: IPatientRepository,
    repoQ?: IQuestionnaireRepository ){
  let res = await repo.insert(appointment);
  assert(res);
  res = await repo.insert(appointment6);
  assert(res);
  if(repoPat){
    await repoPat.insert(appointment.patient);
    await repoPat.insert(appointment6.patient);
  }
  if(repoQ){
    await repoQ.insert(answer.questionnaire);
    await repoQ.insert(answer2.questionnaire);
  }
}

export async function insert(repo: IAnswerRepository){
  let res = await repo.insert(answer);
  assert(res);
  res = await repo.insert(answer2);
  assert(res);
  res = await repo.insert(answer4);
  assert(res);
}

export async function update(repo: IAnswerRepository){
  const res = await repo.update(answer3);
  assert(res);
}

export async function read(repo: IAnswerRepository){
  let res = await repo.read(answer.id);
  if(res){
      assert(compare(answer3, res));
  }else{
      fail();
  }
  res = await repo.read(answer2.id);
  if(res){
      assert(compare(answer2, res));
  }else{
      fail();
  }
}

export async function list(repo: IAnswerRepository){
  const res = await repo.list(answer.appointmentId);
  assert(res.length == 2);
}

export async function del(repo: IAnswerRepository, repoApp: IAppointmentRepository){
  await repo.delete(answer);
  let res = await repo.read(answer.id);
  assertFalse(res);
  await repo.delete(answer2);
  res = await repo.read(answer2.id);
  assertFalse(res);
  await repo.delete(answer4);
  res = await repo.read(answer4.id);
  assertFalse(res);
  await repoApp.delete(appointment);
  await repoApp.delete(appointment6);
}

export async function cleanUp(repoPat: IPatientRepository, repoQ: IQuestionnaireRepository){
  await repoPat.delete(appointment.patient);
  await repoPat.delete(appointment6.patient);
  await repoQ.delete(answer.questionnaire);
  await repoQ.delete(answer2.questionnaire);
}