import { createFileRoute } from "@tanstack/solid-router"
import { type JSXElement, Show, children } from "solid-js"
import hosp from "./assets/hospital.svg"
import walkr from "./assets/walkright.svg"
import letter from "./assets/letter.svg"
import ope from "./assets/ope.svg"
import staff from "./assets/staff.svg"
import master from "./assets/master.svg"
import appointment from "./assets/appointment.svg"
import list from "./assets/list.svg"
import usericon from "./assets/user.svg"
import patient from "./assets/patient.svg"
import file from "./assets/file.svg"
import activity from "./assets/activity.svg"
import questionnaire from "./assets/questionnaire.svg"
import Header from "./-header.tsx"
import { Authenticator, authenticatedUser as user } from "../components/Authenticator.tsx"
import { flex } from "../styled-system/patterns/"
import { css } from "../styled-system/css/"

export const Route = createFileRoute('/')({ component: Home })

type Props = {
  title: string
  href: string
  img: string
};

type BlockProps = {
  title: string
  href: string
  children: JSXElement
  font?: string
};

function Block(props: BlockProps) {
  const c = children(()=>props.children);
  return (
    <div class={ block } onClick={()=>{location.href=props.href}}>
      <div><a class={ a }>
        <div class={ css({ display: "flex", justifyContent: "center", alignItems: "center" }) }>
          { c() }
        </div>
        { props.title }</a>
      </div>
    </div>
  );
}

function MenuBlock(props: Props) {
  return (
    <Block title={ props.title} href={ props.href }>
      <img class={ img } src={ props.img } alt={ props.title } />
    </Block>
  );
}

function Home() {

  return (
    <>
    <Authenticator />
    <Header title="地域連携システム" visible={false} handler={()=>{}} auth={user} />
    <main class={ flex({ direction: "column" }) }>
      <Show when={user().authActivity >= 2 || user().authWeb >= 1}>
      <div>
        <Show when={user().authActivity >= 2}>
        <h1 class={ h1 }>受付関連</h1>
        </Show>
        <Show when={user().authActivity < 2}>
          <h1 class={ h1 }>Web予約</h1>
        </Show>
        <div class={ flex({ direction: "row" }) }>
        <Show when={user().authActivity >= 2}>
          <MenuBlock title="問合せ登録" href="/inquiry" img={ope} />
          <MenuBlock title="活動記録" href="/activity" img={activity} />
        </Show>
        <Show when={user().authWeb >= 1}>
          <MenuBlock title="Web予約" href="/webapp" img={appointment} />
        </Show>
        </div>
      </div>
      </Show>
      <Show when={user().authReferral >= 1}>
      <div>
        <h1 class={ h1 }>紹介関連</h1>
        <div class={ flex({ direction: "row" }) }>
          <Show when={user().authReferral >= 2}>
            <MenuBlock title="紹介登録" href="/appointment" img={appointment} />
            <Block title="逆紹介登録" href="/referralto">
              <div class={ css({ display: "flex", direction: "row", paddingTop: "0.3rem" }) }>
                <img src={hosp} alt="逆紹介登録" class={ css({ width: "4rem" }) } />
                <img src={walkr} alt="逆紹介登録" class={ css({ width: "1.7rem", marginTop: "1.8rem" }) } />
              </div>
            </Block>
            <MenuBlock title="返事登録" href="/reply" img={letter} />
          </Show>
          <Show when={user().authReferral >= 1}>
            <MenuBlock title="紹介状況" href="/process" img={file} />
            <MenuBlock title="問診閲覧" href="/answer/patient" img={questionnaire} />
          </Show>
        </div>
      </div>
      </Show>
      <Show when={user().authFacility >= 1}>
      <div>
        <h1 class={ h1 }>施設関連</h1>
        <div class={ flex({ direction: "row" }) }>
          <MenuBlock title="施設検索" href="/facility" img={hosp} />
          <Show when={user().authFacility >= 2}>
            <MenuBlock title="施設医師登録" href="/staff" img={staff} />
          </Show>
        </div>
      </div>
      </Show>
      <Show when={user().authStatistics >= 1}>
      <div>
        <h1 class={ h1 }>統計</h1>
        <div class={ flex({ direction: "row" }) }>
          <MenuBlock title="紹介統計" href="/statistics" img={list} />
          <MenuBlock title="逆紹介統計" href="/statistics/referralto" img={list} />
          <MenuBlock title="返事統計" href="/statistics/reply" img={list} />
        </div>
      </div>
      </Show>
      <Show when={user().authMaster >= 2}>
      <div>
        <h1 class={ h1 }>その他</h1>
        <div class={ flex({ direction: "row" }) }>
          <MenuBlock title="マスター登録" href="/master" img={master} />
          <MenuBlock title="患者登録" href="/patient" img={patient} />
          <MenuBlock title="ユーザー登録" href="/user" img={usericon} />
        </div>
      </div>
      </Show>
    </main>
    </>
  )
}

//styles
const h1 = css({
  margin: "1rem 0 0 1rem",
  fontSize: "1.6rem",
  color: "#333333",
});

const a = css({
  textDecoration: "none",
  color: "#444444",
  fontSize: "1.2rem",
});

const img = css({
  width: "4rem",
});

const block = css({
  width: "8rem",
  height: "8rem",
  textAlign: "center",
  border: "7px solid",
  borderColor: "#c3c3c3",
  margin: "0.5rem",
  paddingTop: "0.7rem",
  cursor: "pointer",

  _hover: {
    borderColor: "#444444",
  }
});