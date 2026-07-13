import { Show, type Accessor } from "solid-js"
import plus from "./assets/plus.svg"
import logout from "./assets/logout.svg"
import hospital from "./assets/hospitalwhite.svg"
import { del } from "../server/func/auth.ts"
import type { AuthUser } from "../server/domain/user.ts"
import { header } from "../styled-system/recipes/"

type Props = {
    title: string
    handler: ()=>void
    visible: boolean
    auth: Accessor<AuthUser>
}

function App(props: Props){

    function signout(){
        del().then(()=>{});
        location.href = `/login/${props.auth().base}`;
    }

    function getAuthAct(level: number){
        if(props.auth && props.auth().authActivity>=level){
            return true;
        }else{
            return false;
        }
    }

    function getAuthRef(level: number){
        if(props.auth && props.auth().authReferral>=level){
            return true;
        }else{
            return false;
        }
    }

    function getAuthFac(level: number){
        if(props.auth && props.auth().authFacility>=level){
            return true;
        }else{
            return false;
        }
    }

    const head = header();
    return (
        <header class={ head.root }>
        <nav class={ head.menu }>
            <div class={ head.item }>
                <div class={ head.image } title="メニューへ"
                        onClick={()=>{location.href="/"}}>
                    <img src={hospital} alt="メニュー"
                        width="30" height="30" />
                </div>
                <div class={ head.title }>{props.title}</div>
                <div>
                    <Show when={props.visible}>
                        <button class={ head.button } type="button"
                                onClick={props.handler}>
                            <img src={plus} alt="新規作成" />
                            <span>新規作成</span>
                        </button>
                    </Show>
                </div>
            </div>
            <div class={ head.item }>
                <Show when={getAuthAct(2)}>
                <div class={ head.dropMenu }>
                    <div><a href="/inquiry">問合せ対応</a></div>
                </div>
                </Show>
                <Show when={getAuthFac(1)}>
                <div class={ head.dropMenu }>
                    <div><a href="/facility">施設検索</a></div>
                    <Show when={getAuthFac(2)}>
                    <div class={ head.subMenu }>
                        <ul>
                            <li><a href="/staff">施設医師登録</a></li>
                        </ul>
                    </div>
                    </Show>
                </div>
                </Show>
                <Show when={getAuthRef(2)}>
                <div class={ head.dropMenu }>
                    <div><a href="/appointment">紹介登録</a></div>
                    <div class={ head.subMenu }>
                        <ul>
                            <li><a href="/referralto">逆紹介登録</a></li>
                            <li><a href="/reply">返事登録</a></li>
                            <li><hr /></li>
                            <li><a href="/process">紹介状況</a></li>
                        </ul>
                    </div>
                </div>
                </Show>
                <div class={ head.image } title="ログアウト" onClick={signout}>
                    <img src={logout} alt="ログアウト" width="30" height="30" />
                </div>
            </div>
        </nav>
        </header>
    );
}

export default App