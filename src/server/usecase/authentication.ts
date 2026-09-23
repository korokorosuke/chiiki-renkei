import { AuthService } from "../domain/authService.ts"
import type { AuthUser } from "../domain/user.ts"
import { type FetchResult, ng } from "../lib/response.ts"
import { setSessionData } from "../lib/session.ts"
import type { Base } from "../domain/base.ts"
import { info, writeLogWithBase } from "../lib/log.ts"
import { type Result } from "../lib/response.ts"
import * as base64 from "../../lib/base64.ts"

interface IUserService {
  get(id: string): Promise<AuthUser | undefined>
  update(user: AuthUser): Promise<Result>
}

interface IBaseService {
  get(base: string): Promise<Base>
}

export class Authentication{
  constructor(private userService: IUserService, private baseService: IBaseService){ }

  async authenticate(id: string, pwd: string, base: string): Promise<FetchResult<AuthUser>> {
    const password = base64.encode(await AuthService.sha256(pwd));

    const user = await this.userService.get(id);
    if(user && user.locked){
      return ng(["アカウントがロックされています。"]);
    }else if(user && password === user.password){
      if(user.failCount){
        user.failCount = 0;
        await this.userService.update(user);
      }
      const secret = await AuthService.getSecret(id);
      const token = await AuthService.sign(secret, user);
      const baseData = await this.baseService.get(base);
      await setSessionData({token: token, base: baseData});
      user.password = "";

      info("login", "success", base);

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
      await this.userService.update(user);

      writeLogWithBase("info", "login",
        `fail:${id} count:${user.failCount}${user.locked ? " (locked)" : ""}`,
        base, user.id);

      return ng(["ユーザーかパスワードが不正です。"]);
    }else{
      info("login", "fail:" + id, base);

      return ng(["ユーザーかパスワードが不正です。"]);
    }
  }
}