import { createServerFn } from "@tanstack/solid-start"
import { UserService } from "../domain/userService.ts"
import { UserRepository, BaseRepository } from "../infra/allRepository.ts"
import type { AuthUser } from "../domain/user.ts"
import { AuthService } from "../domain/authService.ts"
import { BaseService } from "../domain/baseService.ts"
import { getSessionData, setSessionData, type SessionData } from "../lib/session.ts"
import { type Result, type FetchResult, ok, ng } from "../lib/response.ts"
import * as base64 from "../../lib/base64.ts"

export const get = createServerFn({ method: "GET" })
  .handler(async (): Promise<FetchResult<AuthUser>> => {
    const data: SessionData = await getSessionData();
    if(data.token){
      const user = AuthService.getUser(data.token);
      if(user && await AuthService.validate(data.token)){
        return {ok: true, data: user};
      }
    }
    return ng(["認証に失敗しました。"]);
});

export const create = createServerFn({ method: "POST" })
  .validator((data : {user: AuthUser}) => data)
  .handler(async ({ data }): Promise<FetchResult<AuthUser>> => {
    const id = data.user.id;
    const pwd = data.user.password;
    const base = data.user.base;
    if(!id || !pwd || !base){
      return ng(["入力されていません。"]);
    }

    const password = base64.encode(await AuthService.sha256(pwd));

    const service = new UserService(new UserRepository(base));
    const user = await service.get(id);
    if(user && user.locked){
      return ng(["アカウントがロックされています。"]);
    }else if(user && password === user.password){
      if(user.failCount){
        user.failCount = 0;
        await service.update(user);
      }
      const secret = await AuthService.getSecret(id);
      const token = await AuthService.sign(secret, user);
      const baseData = await (new BaseService(new BaseRepository())).get(base);
      await setSessionData({token: token, base: baseData});
      user.password = "";
      return {ok: true, data: user};
    }else if(user){
      if(user.failCount){
        user.failCount++;
        if(user.failCount >= 5){
          user.locked = true;
        }
      }else{
        user.failCount = 1;
      }
      await service.update(user);
      return ng(["ユーザーかパスワードが不正です。"]);
    }else{
      return ng(["ユーザーかパスワードが不正です。"]);
    }
});

export const del = createServerFn({ method: "POST" })
  .handler(async (): Promise<Result> => {
    await setSessionData({token: "", base: undefined});
    return ok();
});