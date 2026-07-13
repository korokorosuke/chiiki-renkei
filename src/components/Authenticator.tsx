import { onMount, createSignal } from "solid-js"
import { authOrJump } from "../helper/session.ts"
import { initAuthUser } from "../helper/types.ts"
import type { AuthUser } from "../server/domain/user.ts"

type Props = {
  initializer?: ()=>void
}

const [auth, setAuth] = createSignal<AuthUser>(initAuthUser());
export const authenticatedUser = auth;

export function Authenticator(props: Props){
  onMount(async ()=>{
    const user = await authOrJump(`${location.href}`);
    if(user){
      setAuth(user);
      if(props.initializer){
        props.initializer();
      }
    }
  });

  return (
    <div class="authenticator"></div>
  );
}