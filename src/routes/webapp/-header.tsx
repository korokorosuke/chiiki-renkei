import { Show, type Accessor } from "solid-js"
import logout from "../assets/logout.svg"
import { isUser } from "../../helper/webtypes.ts"
import { del } from "../../server/func/auth.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import { header } from "../../styled-system/recipes/"

type Props = {
    create: ()=>void
    history: ()=>void
    home: ()=>void
    user: Accessor<AuthUser>
}

export function Header(props: Props){

    function signout(){
        del().then(()=>{});
        location.href = `/login/${props.user().base}`;
    }

    const head = header();
    return (
        <header class={ head.root }>
        <nav class={ head.menu }>
            <div class={ head.item }>
                <div class={ head.title }><a href="javascript:void(0)"
                    onClick={()=>props.home()}>WEB予約システム</a></div>
                <Show when={isUser(props.user())}>
                <div class={ head.dropMenu }>
                    <a href="javascript: void(0)" onClick={props.create}>新規予約</a></div>
                </Show>
                <div class={ head.dropMenu }>
                    <a href="javascript: void(0)" onClick={props.history}>予約履歴</a></div>
            </div>
            <div class={ head.item }>
                <div class={ head.image } title="ログアウト" onClick={signout}>
                    <img src={logout} alt="ログアウト" width="30" height="30" />
                </div>
            </div>
        </nav>
        </header>
    );
}