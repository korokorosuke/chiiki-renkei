import { For, Show, Switch, Match } from "solid-js"
import { Container, ContainerButton } from "../../components/Container.tsx"
import type { Facility, Contact } from "../../server/domain/facility.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import { button, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type ViewProps = {
    facility: Facility
    modifyData: ()=>void
    auth: AuthUser
}

type ContactProps = {
  contacts: Contact[]
}

function ContactView(props: ContactProps){
  return (
    <For each={props.contacts}>{(c)=>
      <>
      <Show when={c.tel}>
        <Container title={`ＴＥＬ(${c.name})`}>
          <div class={ prewrap }>{c.tel}</div>
        </Container>
      </Show>
      <Show when={c.fax}>
        <Container title={`ＦＡＸ(${c.name})`}>
          <div class={ prewrap }>{c.fax}</div>
        </Container>
      </Show>
      <Show when={c.email}>
        <Container title={`メール(${c.name})`}>
          <div class={ prewrap }>{c.email}</div>
        </Container>
      </Show>
      </>
    }</For>
  );
}

export function ViewArea(props: ViewProps){
  return (
    <div class={ area({ type: "contents" }) }>
      <Switch fallback={
        <Container title="ID">
          <div class={ prewrap }>{props.facility.id}</div>
        </Container>
      }>
        <Match when={props.auth && props.auth.authFacility>=2}>
          <ContainerButton title="ID" buttonTitle="修正"
              onClick={props.modifyData} class={ button({ color: "primary", size: "tiny" }) }>
            <div class={ prewrap }>{props.facility.id}</div>
          </ContainerButton>
        </Match>
      </Switch>
      <Container title="属性">
        <div class={ prewrap }>{props.facility.attribute}</div>
      </Container>
      <Container title="法人名">
        <div class={ prewrap }>{props.facility.nameCorp}</div>
      </Container>
      <Container title="施設名">
        <div>
          <div class={ css({ whiteSpace: "pre-wrap", fontSize: "1.1rem" }) }>{props.facility.kana}</div>
          <div class={ prewrap }>{props.facility.name}</div>
        </div>
      </Container>
      <Container title="ＴＥＬ">
        <div class={ prewrap }>{props.facility.tel}</div>
      </Container>
      <Container title="ＦＡＸ">
        <div class={ prewrap }>{props.facility.fax}</div>
      </Container>
      <Container title="メール">
        <div class={ prewrap }>{props.facility.email}</div>
      </Container>
      <ContactView contacts={props.facility.contacts}/>
      <Container title="住所">
        <div>
          <div class={ prewrap }>{props.facility.address.postalCode}</div>
          <div class={ prewrap }>{props.facility.address.name}{props.facility.address.plus}</div>
        </div>
      </Container>
      <Container title="備考">
        <div class={ prewrap }>{props.facility.memo}</div>
      </Container>
      <Container title="閉院日">
        <div class={ prewrap }>{props.facility.closedDate}</div>
      </Container>
      <Container title="送信用ＦＡＸ">
        <div class={ prewrap }>{props.facility.faxSendNo}</div>
      </Container>
      <Container title="受診報告不要">
        <div class={ prewrap }>{props.facility.notSend? "送らない" : "送る"}</div>
      </Container>
    </div>
  );
}

const prewrap = css({ whiteSpace: "pre-wrap" });