import { describe, test, expect } from "vitest"
import { QuestionnaireRepository } from "../infra/questionnaireRepository.ts"
import { QuestionnaireService } from "./questionnaireService.ts"
import { questionnaire, questionnaire2, questionnaire3 } from "../infra/testdata/questionnaire.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

Kv.test = true;

describe("questionnaire service", () => {
    test("insert", async()=>{
        const repo = new QuestionnaireRepository(BASE);
        const service = new QuestionnaireService(repo);
        questionnaire.id = "";
        questionnaire2.id = "";
        let res = await service.insert(questionnaire);
        expect(res.ok).toBe(true);
        const list = await service.getList();
        if(!list[0].id){
            expect.fail("id is not set");
        }
        questionnaire3.id = list[0].id;
        res = await service.insert(questionnaire2);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new QuestionnaireRepository(BASE);
        const service = new QuestionnaireService(repo);
        const res = await service.update(questionnaire3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new QuestionnaireRepository(BASE);
        const service = new QuestionnaireService(repo);
        let res = await service.get(questionnaire3.id);
        expect(questionnaire3).toEqual(res);
        res = await service.get(questionnaire2.id);
        expect(questionnaire2).toEqual(res);
    });

    test("list", async () => {
        const repo = new QuestionnaireRepository(BASE);
        const service = new QuestionnaireService(repo);
        const res = await service.getList();
        expect(res.length).toBe(2);
    });

    test("delete", async () => {
        const repo = new QuestionnaireRepository(BASE);
        const service = new QuestionnaireService(repo);
        await service.delete(questionnaire);
        let res = await service.get(questionnaire.id);
        expect(res).toBeUndefined();
        await service.delete(questionnaire2);
        res = await service.get(questionnaire2.id);
        expect(res).toBeUndefined();
    });
});