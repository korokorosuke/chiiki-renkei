import { assert, assertFalse, fail } from "@std/assert"
import { UserRepository } from "../infra/userRepository.ts"
import { UserService } from "./userService.ts"
import type { AuthUser } from "./user.ts"
import { user, user2, user3 } from "../infra/testdata/user.ts"
import { BASE } from "../infra//testdata/settings.ts"
import { Kv } from "../infra//kv.ts"

function compare(u1: AuthUser, u2: AuthUser): boolean {
    if(u1.id !== u2.id){
        return false;
    }
    if(u1.name !== u2.name){
        return false;
    }
    if(u1.base !== u2.base){
        return false;
    }
    if(u1.authActivity !== u2.authActivity){
        return false;
    }
    if(u1.authFacility !== u2.authFacility){
        return false;
    }
    if(u1.authReferral !== u2.authReferral){
        return false;
    }
    if(u1.authMaster !== u2.authMaster){
        return false;
    }
    if(u1.authStatistics !== u2.authStatistics){
        return false;
    }
    return true;
}

Kv.test = true;

Deno.test("user service", async (t) => {
    await t.step("insert", async()=>{
        const repo = new UserRepository(BASE);
        const service = new UserService(repo);
        let res = await service.insert(user);
        assert(res.ok);
        res = await service.insert(user2);
        assert(res.ok);
    });

    await t.step("update", async () => {
        const repo = new UserRepository(BASE);
        const service = new UserService(repo);
        const res = await service.update(user3);
        assert(res.ok);
    });

    await t.step("read", async () => {
        const repo = new UserRepository(BASE);
        const service = new UserService(repo);
        let res = await service.get(user.id);
        if(res){
            assert(compare(user3, res));
        }else{
            fail();
        }
        res = await service.get(user2.id);
        if(res){
            assert(compare(user2, res));
        }else{
            fail();
        }
    });

    await t.step("list", async () => {
        const repo = new UserRepository(BASE);
        const service = new UserService(repo);
        let res = await service.getList("usagi");
        if(res.length === 2){
            assert(compare(user3, res[0]));
            assert(compare(user2, res[1]));
        }else{
            fail();
        }
        res = await service.getList("usagi2");
        if(res.length === 1){
            assert(compare(user2, res[0]));
        }else{
            fail();
        }
    });

    await t.step("delete", async () => {
        const repo = new UserRepository(BASE);
        const service = new UserService(repo);
        await service.delete(user);
        let res = await service.get(user.id);
        assertFalse(res);
        await service.delete(user2);
        res = await service.get(user2.id);
        assertFalse(res);
    });
});