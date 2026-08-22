import type { Answer } from "../../domain/answer.ts"
import type { IAnswerRepository } from "../../domain/answerService.ts"
import { initialize } from "../../domain/questionnaire.ts"
import { AppointmentRepository } from "./appointmentRepository.ts"
import { type QuestionnaireDBResult, toQuestionnaire } from "./questionnaireRepository.ts"
import { Db } from "./db.ts"
import { answer, answerItem } from "../../db/schema.ts"
import { and, eq } from "drizzle-orm"
import { LogService } from "../../domain/logService.ts"
import { LogRepository } from "./logRepository.ts"

type AnswerData = typeof answer.$inferInsert;

type AnswerDBResult = {
  id: string,
  questionnaire: QuestionnaireDBResult | null,
  appointmentId: string,
  appointment: {
    patientId: string,
  } | null,
  appointmentDate: string | null,
  inputDate: string | null,
  inputDateString?: string,
  answerItems: {
    itemId: string,
  }[],
}

export class AnswerRepository implements IAnswerRepository {
  database: Db
  base: string
  constructor(base: string){
    this.database = new Db();
    this.base = base;
  }

  toData(val: Answer): AnswerData{
    return {
      base: this.base,
      id: val.id,
      questionnaireId: val.questionnaire.id,
      appointmentId: val.appointmentId,
      appointmentDate: val.appointmentDate === "" ? null : val.appointmentDate,
      inputDate: val.inputDate === "" ? null : val.inputDate,
    };
  }
  fromData(val: AnswerDBResult): Answer {
    return {
      id: val.id,
      questionnaire: val.questionnaire ? toQuestionnaire(val.questionnaire) : initialize(),
      appointmentId: val.appointmentId,
      appointmentDate: val.appointmentDate ?? undefined,
      inputDate: val.inputDateString,
      items: val.answerItems ? val.answerItems.map(item => item.itemId) : [],
    };
  }
  async getPatientId(val: Answer): Promise<string|undefined> {
    const appRepo = new AppointmentRepository(this.base);
    const app = await appRepo.read(val.appointmentId);
    if(!app){
      return undefined;
    }
    return app.patient.id;
  }

  async insert(val: Answer): Promise<boolean> {
    const patId = await this.getPatientId(val);
    if(!patId){
        return false;
    }
    const db = await this.database.open();
    const res = await db.transaction(async (tx) => {
      try{
        await tx.insert(answer).values(this.toData(val));
        if(val.items.length > 0){
          await tx.insert(answerItem)
            .values(val.items.map(item => ({answerId: val.id, itemId: item})));
        }
        return true;
      }catch(e){
        tx.rollback();
        new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} insert`, e);
        return false;
      }
    });
    this.database.close();
    return res;
  }

  async update(val: Answer): Promise<boolean> {
    const patId = await this.getPatientId(val);
    if(!patId){
        return false;
    }
    const db = await this.database.open();
    const res = await db.transaction(async (tx) => {
      try{
        await tx.update(answer).set(this.toData(val))
          .where(
            and(
              eq(answer.base, this.base),
              eq(answer.id, val.id)
            ));
        await tx.delete(answerItem)
          .where(eq(answerItem.answerId, val.id));
        if(val.items.length > 0){
          await tx.insert(answerItem)
            .values(val.items.map(item => ({answerId: val.id, itemId: item})));
        }
        return true;
      }catch(e){
        tx.rollback();
        new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} update`, e);
        return false;
      }
    });
    this.database.close();
    return res;
  }

  async delete(val: Answer): Promise<void> {
    const db = await this.database.open();
    await db.transaction(async (tx) => {
      try{
        await tx.delete(answer)
          .where(
            and(
              eq(answer.base, this.base),
              eq(answer.id, val.id)));
        await tx.delete(answerItem)
          .where(eq(answerItem.answerId, val.id));
      }catch(e){
        tx.rollback();
        new LogService(new LogRepository(this.base)).fatal(`${this.constructor.name} delete`, e);
      }
    });
    this.database.close();
  }

  async select(cond: object): Promise<AnswerDBResult[]>{
    const db = await this.database.open();
    return await db.query.answer.findMany({
      columns: {
        id: true,
        appointmentId: true,
        appointmentDate: true,
        inputDate: true,
      },
      extras: {
        inputDateString: (record, { sql }) => sql<string>`to_char(${record.inputDate}, 'YYYY-MM-DD"T"HH24:MI:SS')`,
      },
      where: cond,
      with: {
        answerItems: {
          columns: {
            itemId: true,
          }
        },
        appointment: {
          columns: {
            patientId: true,
          }
        },
        questionnaire: {
          columns: {
            base: false,
          },
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
        }
      }
    });
  }

  async read(id: string): Promise<Answer|undefined> {
    const res = await this.select({base: this.base, id: id});
    if(res.length > 0){
      return this.fromData(res[0]);
    }
    return undefined;
  }

  async list(appId: string): Promise<Answer[]> {
    const res = await this.select({base: this.base, appointmentId: appId});
    if(res.length > 0){
      return res.map(answer => this.fromData(answer));
    }
    return [];
  }

  async listByPatient(patientId: string): Promise<Answer[]> {
    const res = await this.select({base: this.base, appointment: {patientId: patientId}});
    if(res.length > 0){
      return res.map(answer => this.fromData(answer));
    }
    return [];
  }
}