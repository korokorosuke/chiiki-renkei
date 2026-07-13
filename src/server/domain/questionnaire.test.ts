import { assert, assertFalse, fail } from "@std/assert"
import { QuestionnaireRepository } from "../infra/questionnaireRepository.ts"
import { QuestionnaireService } from "./questionnaireService.ts"
import type { Questionnaire } from "./questionnaire.ts"
import { questionnaire, questionnaire2, questionnaire3 } from "../infra/testdata/questionnaire.ts"
import { BASE } from "../infra/testdata/settings.ts"
import { Kv } from "../infra/kv.ts"

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
        if(item1.choices?.length !== item2.choices?.length){
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

Kv.test = true;

Deno.test("questionnaire service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new QuestionnaireRepository(BASE);
        const service = new QuestionnaireService(repo);
        questionnaire.id = "";
        questionnaire2.id = "";
        let res = await service.insert(questionnaire);
        assert(res.ok);
        const list = await service.getList();
        if(!list[0].id){
            fail("id is not set");
        }
        questionnaire3.id = list[0].id;
        res = await service.insert(questionnaire2);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new QuestionnaireRepository(BASE);
        const service = new QuestionnaireService(repo);
        const res = await service.update(questionnaire3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new QuestionnaireRepository(BASE);
        const service = new QuestionnaireService(repo);
        let res = await service.get(questionnaire3.id);
        if(res){
            assert(compare(questionnaire3, res));
        }else{
            fail();
        }
        res = await service.get(questionnaire2.id);
        if(res){
            assert(compare(questionnaire2, res));
        }else{
            fail();
        }
    });
    
    await t.step("list", async () => {
        const repo = new QuestionnaireRepository(BASE);
        const service = new QuestionnaireService(repo);
        const res = await service.getList();
        assert(res.length == 2);
    });

    await t.step("delete", async () => {
        const repo = new QuestionnaireRepository(BASE);
        const service = new QuestionnaireService(repo);
        await service.delete(questionnaire);
        let res = await service.get(questionnaire.id);
        assertFalse(res);
        await service.delete(questionnaire2);
        res = await service.get(questionnaire2.id);
        assertFalse(res);
    });
});