import { Show } from "solid-js"
import plus from "../assets/plus.svg"
import logout from "../assets/logout.svg"
import hospital from "../assets/hospitalwhite.svg"
import { del } from "../server/func/auth.ts"
import type { AuthUser } from "../server/domain/user.ts"
import { token } from "../styled-system/tokens/"
import { root, menu, item, title, button, image, dropMenu, subMenu } from "./-headerCss.ts"

type Props = {
    title: string
    handler: ()=>void
    visible: boolean
    auth: AuthUser
    color: string
}

function App(props: Props){

    function signout(){
        del().then(()=>{});
        location.href = `/login/${props.auth.base}`;
    }

    function getAuthAct(level: number){
        if(props.auth && props.auth.authActivity>=level){
            return true;
        }else{
            return false;
        }
    }

    function getAuthRef(level: number){
        if(props.auth && props.auth.authReferral>=level){
            return true;
        }else{
            return false;
        }
    }

    function getAuthFac(level: number){
        if(props.auth && props.auth.authFacility>=level){
            return true;
        }else{
            return false;
        }
    }

    return (
      <header class={ root }
          /* @ts-ignore */
          style={{"--color": "white", "--color-bg": token(`colors.${props.color}`),
          /* @ts-ignore */
          "--color-bg-hover": token(`colors.${props.color.replace("600", "500").replace("800", "700")}`)}}>
        <nav class={ menu }>
            <div class={ item }>
                <div class={ image } title="メニューへ"
                        onClick={()=>{location.href="/"}}>
                    <img src={hospital} alt="メニュー"
                        width="30" height="30" />
                </div>
                <div class={ title }>{props.title}</div>
                <div>
                    <Show when={props.visible}>
                        <button class={ button } type="button"
                                onClick={props.handler}>
                            <img src={plus} alt="新規作成" />
                            <span>新規作成</span>
                        </button>
                    </Show>
                </div>
            </div>
            <div class={ item }>
                <Show when={getAuthAct(2)}>
                <div class={ dropMenu }>
                    <div><a href="/inquiry">問合せ対応</a></div>
                </div>
                </Show>
                <Show when={getAuthFac(1)}>
                <div class={ dropMenu }>
                    <div><a href="/facility">施設検索</a></div>
                    <Show when={getAuthFac(2)}>
                    <div class={ subMenu }>
                        <ul>
                            <li><a href="/staff">施設医師登録</a></li>
                        </ul>
                    </div>
                    </Show>
                </div>
                </Show>
                <Show when={getAuthRef(2)}>
                <div class={ dropMenu }>
                    <div><a href="/appointment">紹介登録</a></div>
                    <div class={ subMenu }>
                        <ul>
                            <li><a href="/referralto">逆紹介登録</a></li>
                            <li><a href="/reply">返事登録</a></li>
                            <li><hr /></li>
                            <li><a href="/process">紹介状況</a></li>
                        </ul>
                    </div>
                </div>
                </Show>
                <div class={ image } title="ログアウト" onClick={signout}>
                    <img src={logout} alt="ログアウト" width="30" height="30" />
                </div>
            </div>
        </nav>
        </header>
    );
}

export default App