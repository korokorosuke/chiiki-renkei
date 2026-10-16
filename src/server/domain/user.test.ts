import { describe, test, expect } from "vitest"
import { UserRepository } from "../infra/userRepository.ts"
import { UserService } from "./userService.ts"
import { user, user2, user3 } from "../infra/testdata/user.ts"
import { BASE } from "../infra//testdata/settings.ts"
import { Kv } from "../infra//kv.ts"

Kv.test = true;

describe("user service", () => {
    test("insert", async()=>{
        const repo = new UserRepository(BASE);
        const service = new UserService(repo);
        let res = await service.insert(user);
        expect(res.ok).toBe(true);
        res = await service.insert(user2);
        expect(res.ok).toBe(true);
    });

    test("update", async () => {
        const repo = new UserRepository(BASE);
        const service = new UserService(repo);
        const res = await service.update(user3);
        expect(res.ok).toBe(true);
    });

    test("read", async () => {
        const repo = new UserRepository(BASE);
        const service = new UserService(repo);
        let res = await service.get(user.id);
        expect(user3).toEqual(res);
        res = await service.get(user2.id);
        expect(user2).toEqual(res);
    });

    test("list", async () => {
        const repo = new UserRepository(BASE);
        const service = new UserService(repo);
        let res = await service.getList("usagi");
        if(res.length === 2){
            expect(user3).toEqual(res[0]);
            expect(user2).toEqual(res[1]);
        }else{
            expect.fail();
        }
        res = await service.getList("usagi2");
        if(res.length === 1){
            expect(user2).toEqual(res[0]);
        }else{
            expect.fail();
        }
    });

    test("delete", async () => {
        const repo = new UserRepository(BASE);
        const service = new UserService(repo);
        await service.delete(user);
        let res = await service.get(user.id);
        expect(res).toBeUndefined();
        await service.delete(user2);
        res = await service.get(user2.id);
        expect(res).toBeUndefined();
    });
});