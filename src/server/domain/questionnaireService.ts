import { type Questionnaire, validate } from "./questionnaire.ts"
import { MainService, type IRepository, setId } from "./mainService.ts"

export interface IQuestionnaireRepository extends IRepository<Questionnaire>{
    list(): Promise<Questionnaire[]>
}

export class QuestionnaireService extends MainService<Questionnaire, IQuestionnaireRepository>{
    constructor(i: IQuestionnaireRepository){
        super(i, validate, setId);
    }

    async getList(): Promise<Questionnaire[]>{
        return await this.getRepository().list();
    }

    async getListByDept(dept: string): Promise<Questionnaire[]>{
        const all = await this.getRepository().list();
        return all.filter(q => q.depts?.includes(dept));
    }
}