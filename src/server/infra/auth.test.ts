import { describe, test, expect } from "vitest"
import { UserService } from "../domain/userService.ts"
import { UserRepository } from "./userRepository.ts"
import type { AuthUser } from "../domain/user.ts"
import { Kv } from "./kv.ts"
import * as base64 from "../../lib/base64.ts"
import { AuthService } from "../domain/authService.ts"
import { BASE } from "./testdata/settings.ts"

Kv.test = true;

describe("auth repository", () => {
    test("insert", async()=>{
        const service = new UserService(new UserRepository(BASE));
        const user: AuthUser = {id: "00001", name:"hoge",
            department:"01", base: BASE, authActivity:0,authFacility:1,
            authMaster:2, authWeb: 0, authLog: 0,
            authReferral:2,authStatistics:1,password:"admin" };
        const user2: AuthUser = {id: "00002", name:"hoge",
            department:"01", base: BASE,authActivity:0,authFacility:1,
            authMaster:2, authWeb: 0, authLog: 0,
            authReferral:2,authStatistics:1,password:"admin" };
        if(user.password){
            user.password = base64.encode(
                await AuthService.sha256(user.password));
            await service.insert(user);

            const secret = await AuthService.getSecret(user.id);
            const token = await AuthService.sign(secret, user);
            const res = await AuthService.verify(secret, token);
            expect(res).toBe(true);
            const payload = AuthService.payload(token);
            expect(payload.autha).toBe(user.authActivity);
            expect(payload.authf).toBe(user.authFacility);
            expect(payload.authr).toBe(user.authReferral);
            expect(payload.auths).toBe(user.authStatistics);
            await service.delete(user);

            const secret2 = await AuthService.getSecret(user2.id);
            const res2 = await AuthService.verify(secret2, token);
            expect(res2).toBe(false);
        }else{
            expect.fail();
        }
    });
});