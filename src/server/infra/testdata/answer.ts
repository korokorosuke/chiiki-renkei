import { expect } from "vitest"
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
      condition: undefined,
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
      condition: undefined,
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
      condition: undefined,
    },{
      id: "q4",
      type: "text",
      require: true,
      question: "質問４",
      choices: [],
      condition: {
        q: "q3",
        a: "c1",
      }
    },{
      id: "q5",
      type: "text",
      require: true,
      question: "質問５",
      choices: [],
      condition: undefined,
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

export async function prepare(repo: IAppointmentRepository, repoPat?: IPatientRepository,
    repoQ?: IQuestionnaireRepository ){
  let res = await repo.insert(appointment);
  expect(res).toBe(true);
  res = await repo.insert(appointment6);
  expect(res).toBe(true);
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
  expect(res).toBe(true);
  res = await repo.insert(answer2);
  expect(res).toBe(true);
  res = await repo.insert(answer4);
  expect(res).toBe(true);
}

export async function update(repo: IAnswerRepository){
  const res = await repo.update(answer3);
  expect(res).toBe(true);
}

export async function read(repo: IAnswerRepository){
  let res = await repo.read(answer.id);
  expect(answer3).toEqual(res);
  res = await repo.read(answer2.id);
  expect(answer2).toEqual(res);
}

export async function list(repo: IAnswerRepository){
  const res = await repo.list(answer.appointmentId);
  expect(res.length).toBe(2);
}

export async function del(repo: IAnswerRepository, repoApp: IAppointmentRepository){
  await repo.delete(answer);
  let res = await repo.read(answer.id);
  expect(res).toBeUndefined();
  await repo.delete(answer2);
  res = await repo.read(answer2.id);
  expect(res).toBeUndefined();
  await repo.delete(answer4);
  res = await repo.read(answer4.id);
  expect(res).toBeUndefined();
  await repoApp.delete(appointment);
  await repoApp.delete(appointment6);
}

export async function cleanUp(repoPat: IPatientRepository, repoQ: IQuestionnaireRepository){
  await repoPat.delete(appointment.patient);
  await repoPat.delete(appointment6.patient);
  await repoQ.delete(answer.questionnaire);
  await repoQ.delete(answer2.questionnaire);
}