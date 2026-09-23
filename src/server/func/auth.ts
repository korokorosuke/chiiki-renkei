import { createServerFn } from "@tanstack/solid-start"
import { UserService } from "../domain/userService.ts"
import { UserRepository, BaseRepository } from "../infra/allRepository.ts"
import type { AuthUser } from "../domain/user.ts"
import { AuthService } from "../domain/authService.ts"
import { BaseService } from "../domain/baseService.ts"
import { getSessionData, setSessionData, type SessionData } from "../lib/session.ts"
import { type Result, type FetchResult, ok, ng } from "../lib/response.ts"
import { writeLogWithBase } from "./log.ts"
import { Authentication } from "../usecase/authentication.ts"

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

    const auth = new Authentication(
      new UserService(new UserRepository(base)),
      new BaseService(new BaseRepository()));
    return await auth.authenticate(id, pwd, base);
});

export const del = createServerFn({ method: "POST" })
  .handler(async (): Promise<Result> => {
    const res = await get();
    await setSessionData({token: "", base: undefined});
    if(res.ok){
      writeLogWithBase({ data: { base: res.data.base, level: "info", title: "logout", details: "success",
        userId: res.ok ? res.data.id : undefined } });
    }
    return ok();
});