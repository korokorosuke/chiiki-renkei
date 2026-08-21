import type { Questionnaire, Question } from "../../domain/questionnaire.ts"
import type { IQuestionnaireRepository } from "../../domain/questionnaireService.ts"
import { Db } from "./db.ts"
import { questionnaire, question, questionChoice, questionCondition, questionnaireDept } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"

type QuestionnaireData = typeof questionnaire.$inferInsert;
type QuestionData = typeof question.$inferInsert;

export type QuestionnaireDBResult = {
  id: string,
  title: string,
  description: string,
  questionnaireDepts: {
    deptId: string,
  }[],
  questions: {
    id: string,
    type: string,
    require: boolean,
    title: string,
    questionChoices: {
      id: string,
      text: string,
    }[],
    questionCondition: {
      q: string,
      a: string,
    } | null,
  }[],
}

export function toQuestionnaire(val: QuestionnaireDBResult): Questionnaire{
  return {
    id: val.id,
    title: val.title,
    description: val.description,
    depts: val.questionnaireDepts?.map((dept) => dept.deptId) ?? [],
    items: val.questions?.map((question) => ({
      id: question.id,
      type: question.type,
      require: question.require,
      question: question.title,
      choices: question.questionChoices?.map(choice=>({
        id: choice.id,
        text: choice.text,
      })) ?? [],
      condition: question.questionCondition ? {
        q: question.questionCondition.q,
        a: question.questionCondition.a,
      } : undefined,
    })) ?? [],
  };
}

export class QuestionnaireRepository implements IQuestionnaireRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Questionnaire): QuestionnaireData{
    return {
      base: this.base,
      id: val.id,
      title: val.title,
      description: val.description,
    };
  }
  toQuestionData(val: Question, id: string, i: number): QuestionData{
    return {
      id: val.id,
      questionnaireId: id,
      type: val.type,
      require: val.require,
      title: val.question,
      order: i,
    };
  }
  fromData(val: QuestionnaireDBResult): Questionnaire{
    return toQuestionnaire(val);
  }

  async insert(val: Questionnaire): Promise<boolean> {
    const db = await this.database.open();
    const res = await db.transaction(async (tx) => {
      try{
        await tx.insert(questionnaire).values(this.toData(val));
        await tx.insert(questionnaireDept)
          .values(val.depts.map((dept) => ({
            questionnaireId: val.id,
            deptId: dept,
          })));
        if(val.items.length > 0){
          await tx.insert(question)
            .values(val.items.map((item, i) => this.toQuestionData(item, val.id, i)));
          const choices = [];
          const conds = [];
          for(const item of val.items){
            if(item.condition){
              conds.push({
                questionnaireId: val.id,
                questionId: item.id,
                q: item.condition.q,
                a: item.condition.a,
              });
            }
            if(item.choices){
              let i = 0;
              for(const choice of item.choices){
                choices.push({
                  questionnaireId: val.id,
                  questionId: item.id,
                  id: choice.id,
                  text: choice.text,
                  order: i
                });
                i += 1;
              }
            }
          }
          if(conds.length > 0){
            await tx.insert(questionCondition)
              .values(conds);
          }
          if(choices.length > 0){
            await tx.insert(questionChoice)
              .values(choices);
          }
        }
        return true;
      }catch(e){
        console.log(e);
        tx.rollback();
        return false;
      }
    });
    this.database.close();
    return res;
  }

  async update(val: Questionnaire): Promise<boolean> {
    const db = await this.database.open();
    const res = await db.transaction(async (tx) => {
      try{
        await tx.update(questionnaire).set(this.toData(val))
          .where(and(
            eq(questionnaire.base, this.base),
            eq(questionnaire.id, val.id)
          ));
        await tx.delete(question).where(eq(question.questionnaireId, val.id));
        await tx.delete(questionnaireDept).where(eq(questionnaireDept.questionnaireId, val.id));
        await tx.delete(questionCondition).where(eq(questionCondition.questionnaireId, val.id));
        await tx.delete(questionChoice).where(eq(questionChoice.questionnaireId, val.id));
        if(val.items.length > 0){
          await tx.insert(question)
            .values(val.items.map((item, i) => this.toQuestionData(item, val.id, i)));
          await tx.insert(questionnaireDept)
            .values(val.depts.map(dept=>({
              questionnaireId: val.id,
              deptId: dept,
            })));
          for(const item of val.items){
            if(item.condition){
              await tx.insert(questionCondition)
                .values({
                  questionnaireId: val.id,
                  questionId: item.id,
                  q: item.condition.q,
                  a: item.condition.a,
                })
                .onConflictDoUpdate({
                  target: [questionCondition.questionnaireId, questionCondition.questionId],
                  set: {
                    q: item.condition.q,
                    a: item.condition.a,
                  },
                });
            }
            if(item.choices){
              let i = 0;
              for(const choice of item.choices){
                await tx.insert(questionChoice)
                  .values({
                    questionnaireId: val.id,
                    questionId: item.id,
                    id: choice.id,
                    text: choice.text,
                    order: i
                  });
                i += 1;
              }
            }
          }
        }
        return true;
      }catch(e){
        console.log(e);
        tx.rollback();
        return false;
      }
    });
    this.database.close();
    return res;
  }

  async delete(val: Questionnaire): Promise<void> {
    const db = await this.database.open();
    await db.transaction(async (tx) => {
      try{
        await tx.delete(questionnaire)
          .where(
            eq(questionnaire.id, val.id));
        await tx.delete(questionnaireDept)
          .where(
            eq(questionnaireDept.questionnaireId, val.id));
        await tx.delete(question)
          .where(
            eq(question.questionnaireId, val.id));
        await tx.delete(questionCondition)
          .where(
            eq(questionCondition.questionnaireId, val.id));
        await tx.delete(questionChoice)
          .where(
            eq(questionChoice.questionnaireId, val.id));
      }catch(e){
        console.log(e);
        tx.rollback();
      }
    });
    this.database.close();
  }

  async select(cond: object): Promise<QuestionnaireDBResult[]> {
    const db = await this.database.open();
    return await db.query.questionnaire.findMany({
      columns: {
        base: false,
      },
      where: cond,
      with: {
        questions: {
          columns: {
            id: true,
            type: true,
            require: true,
            title: true,
          },
          orderBy: {order: "asc"},
          with: {
            questionCondition: {
              columns: {
                q: true,
                a: true,
              },
            },
            questionChoices: {
              columns: {
                id: true,
                text: true,
              },
              orderBy: {order: "asc"}
            },
          }
        },
        questionnaireDepts: {
          columns: {
            deptId: true,
          }
        }
      }
    });
  }

  async read(id: string): Promise<Questionnaire|undefined> {
    const res = await this.select({id: id});
    if(res.length > 0){
      return this.fromData(res[0]);
    }
    return undefined;
  }

  async list(): Promise<Questionnaire[]> {
    const res = await this.select({base: this.base});
    return res.map((val) => this.fromData(val));
  }
}