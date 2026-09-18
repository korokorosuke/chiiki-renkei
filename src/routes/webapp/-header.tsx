import { Show } from "solid-js"
import logout from "../assets/logout.svg"
import { isUser } from "../../helper/webtypes.ts"
import { del } from "../../server/func/auth.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import { root, menu, item, title, image, dropMenu } from "../-headerCss.ts"
import { token } from "../../styled-system/tokens/"

type Props = {
    create: ()=>void
    history: ()=>void
    home: ()=>void
    user: AuthUser
    color: string
}

export function Header(props: Props){

    function signout(){
        del().then(()=>{});
        location.href = `/login/${props.user.base}`;
    }

    return (
        <header class={ root }
            /* @ts-ignore */
            style={{"--color": "white", "--color-bg": token(`colors.${props.color}`),
            /* @ts-ignore */
            "--color-bg-hover": token(`colors.${props.color.replace("600", "500").replace("800", "700")}`)}}>
        <nav class={ menu }>
            <div class={ item }>
                <div class={ title }><a href="javascript:void(0)"
                    onClick={()=>props.home()}>WEB予約システム</a></div>
                <Show when={isUser(props.user)}>
                <div class={ dropMenu }>
                    <a href="javascript: void(0)" onClick={props.create}>新規予約</a></div>
                </Show>
                <div class={ dropMenu }>
                    <a href="javascript: void(0)" onClick={props.history}>予約履歴</a></div>
            </div>
            <div class={ item }>
                <div class={ image } title="ログアウト" onClick={signout}>
                    <img src={logout} alt="ログアウト" width="30" height="30" />
                </div>
            </div>
        </nav>
        </header>
    );
}