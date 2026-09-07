import { createSignal, onMount, Show, For, Suspense, type JSXElement, type Accessor } from "solid-js"
import { initAuthUser } from "../../helper/types.ts"
import { getLoginNotices } from "../../server/func/notice.ts"
import { create } from "../../server/func/auth.ts"
import { NormalDialog, showDialog } from "../../components/NormalDialog.tsx"
import { About } from "../-about.tsx"
import type { AuthUser } from "../../server/domain/user.ts"
import type { Notice } from "../../server/domain/notice.ts"
import { getLocalStorage, setLocalStorage } from "../../lib/storage.ts"
import { css } from "../../styled-system/css/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/login/{-$base}")({ component: App });

const STORAGE_KEY = "reco_base";

function App() {
  const [user, setUser] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [message, setMessage] = createSignal("　");
  const [base, setBase] = createSignal("");
  const [visible, setVisible] = createSignal(true);
  const [notices, setNotices] = createSignal<Notice[]>([]);
  const [disabled, setDisabled] = createSignal(false);

  let input: HTMLInputElement | undefined;

  const params = Route.useParams();
  const paramBase = params().base;

  if(paramBase){
    setBase(paramBase);
    setVisible(false);
  }else{
    const base = getLocalStorage(STORAGE_KEY);
    if(base){
      location.href = `/login/${base}`;
      return;
    }
    return <div>ログイン画面から再度ログインしてください</div>;
  }

  function handleKeyUp(e: KeyboardEvent){
    if(e.key === "Enter" && user() && password()){
      handleClick();
    }
  }

  function isWebOnly(auth: AuthUser): boolean{
    return auth.authWeb > 0 && auth.authActivity === 0 &&
      auth.authFacility === 0 && auth.authMaster === 0 &&
      auth.authReferral === 0 && auth.authStatistics === 0;
  }

  function handleClick(){
    setDisabled(true);
    create({data: { user: {
      ...initAuthUser(), id: user(), password: password(), base: base()
    }}}).then(res=>{
      if(res.ok){
        setLocalStorage(STORAGE_KEY, base());
        if(isWebOnly(res.data!)){
          location.href = "/webapp";
          return;
        }
        const url = new URL(location.href);
        const params = url.searchParams;
        const src = params.get("src");
        if(src && !/[<>"'&; \\]/.test(src)){
          location.href = src;
        }else{
          location.href = "/";
        }
      }else{
        setDisabled(false);
        setMessage(res.errors![0]);
      }
    });
  }

  onMount(()=>{
    getLoginNotices({data: {base: base() }}).then((res)=>{
      setNotices(res);
    });
    if(input){
      input.focus();
    }
  });

  function NoticeMessage(props: {notice: Notice, i: Accessor<number>}): JSXElement{
    return (
      <div>
        <Show when={props.i()>=1}>
          <div></div>
        </Show>
        <div>{props.notice.message}</div>
      </div>
    );
  }

  return (
    <>
    <main class={ css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      minWidth: "90vw",
      minHeight: "90vh",
      textAlign: "center",
      verticalAlign: "middle",
      fontSize: "2rem",
      margin: "0!",
    }) }>
      <div class={ css({
        display: "flex",
        flexDirection: "column",
        width: "50%",
        minHeight: "90vh",
        borderRight: "#7f7f7f 1px solid",
      }) }>
        <div>
          <label class={ css({ width: "20rem", fontSize: "2.5rem" }) }>地域連携システム</label>
          <div class={ css(messageStyle, { color: "red", }) }>
            <Suspense fallback={<div>loading</div>}>
              <For each={notices()}>{(notice, i)=>
                notice.importance ? <NoticeMessage notice={notice} i={i} /> : null
              }</For>
            </Suspense>
          </div>
          <div class={ css(messageStyle) }>
            <Suspense fallback={<div>loading</div>}>
              <For each={notices()}>{(notice, i)=>
                !notice.importance ? <NoticeMessage notice={notice} i={i} /> : null
              }</For>
            </Suspense>
          </div>
        </div>
      </div>

      <div class={ css({
          width: "50%",
          display: "flex",
          justifyItems: "center",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap", }) }>
        <div class={ css({
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            alignItems: "stretch",
            textAlign: "left",
            "& label": { color: "#474747" } }) }>
          <div>
            <label class={ css({ width: "20rem", fontSize: "2.5rem" }) }>ログイン</label>
          </div>
          <div class={ css({ marginTop: "1rem" }) }>
            <input type="text" class={ inputStyle }
              value={user()} onChange={(e)=>setUser(e.target.value)}
              required placeholder="ユーザー" ref={input} onKeyUp={handleKeyUp} />
          </div>
          <div class={ css({ marginTop: "1rem" }) }>
            <input type="password" class={ inputStyle }
              value={password()} onChange={(e)=>setPassword(e.target.value)}
              required placeholder="パスワード" onKeyUp={handleKeyUp} />
          </div>
          <Show when={visible()}>
          <div class={ css({ marginTop: "1rem" }) }>
            <input type="text" class={ inputStyle }
              value={base()} onChange={(e)=>setBase(e.target.value)}
              required placeholder="施設コード" onKeyUp={handleKeyUp} />
          </div>
          </Show>
          <div>
            <button type="button" class={ buttonStyle }
              onClick={handleClick}
              disabled={disabled()}>ログイン</button>
          </div>
          <div class={ css({ color: "#ff789e", width: "25rem" }) }>{message()}</div>
          <a class={ css({ fontSize: "1rem", cursor: "pointer" }) }
            onClick={showDialog}>このシステムについて</a>
        </div>
      </div>
      <NormalDialog>
        <About />
      </NormalDialog>
    </main>
    </>
  )
}

// Styles
const elemWidth = "25rem";
const buttonColor = "#4a89ff";
const buttonColorHover = "#2f78ff";
const messageStyle = {
  fontSize: "1.3rem",
  marginTop: "1rem",
  padding: "1rem",
  whiteSpace: "pre-wrap",
  textAlign: "left",
};
const inputStyle = css({
  padding: "px.10",
  fontSize: "1.5rem!",
  borderRadius: "5px",
  border: "solid 2px #b0b0b0",
  width: elemWidth,
  _focus: {
      outlineColor: "#82b4ff",
  }
});
const buttonStyle = css({
  marginTop: "3rem",
  backgroundColor: buttonColor,
  width: `calc(${elemWidth} + 1.3rem)`,
  borderRadius: "5px",
  border: "1px solid transparent",
  padding: "0.3em 1.2em",
  fontWeight: "500",
  fontSize: "1.5rem",
  color: "white",
  cursor: "pointer",
  transition: "border-color 0.25s",
  _hover: {
      backgroundColor: buttonColorHover,
  },
  _focus: {
      outline: "4px auto -webkit-focus-ring-color",
  },
  _focusVisible: {
      outline: "4px auto -webkit-focus-ring-color",
  },
  _disabled: {
      backgroundColor: "disabled!",
      cursor: "not-allowed",
  },
});