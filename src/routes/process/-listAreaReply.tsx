import { For, Show, type Accessor } from "solid-js"
import type { Referral } from "../../server/domain/referral.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import { procStyles, titleStyles } from "./-css.ts"
import { css } from "../../styled-system/css/"

type Props = {
    list: Accessor<Referral[]>
    auth: Accessor<AuthUser>
}

export function ListAreaReply(props: Props) {
  function handleClick(referral: Referral){
    if(props.auth().authReferral>=2){
      location.href = `/appointment/${referral.patient.id}/${referral.id}`;
    }
  }
  function handleClickReply(refId: string, repId: string){
    if(props.auth().authReferral>=2){
      location.href = `/reply/${refId}/${repId}`;
    }
  }

  return (
    <div>
      <div class={ titleStyles }>紹介</div>
      <For each={props.list()}>{(referral)=>
        <div class={ css({ marginBottom: "1rem" }) }>
          <div class={ procStyles } onClick={()=>handleClick(referral)}>
            <span class={ css({ fontFamily: "number" }) }>{referral.date}</span>
            <span>[{referral.department.name}]</span>
            <span>{referral.dr.name}</span>
            <span><p class={ css({ fontFamily: "number" }) }>{referral.facility.id}</p>:{referral.facility.name}</span>
          </div>
          <For each={referral.replies}>{rep=>
            <Show when={rep.id}>
              <div class={ procStyles } onClick={()=>handleClickReply(referral.id, rep.id)}>
                <span>→</span>
                <span class={ css({ fontFamily: "number" }) }>{rep.date}</span>
                <span>[{rep.department.name}]</span>
                <span>{rep.dr.name}</span>
                <span>({rep.classification.name})</span>
              </div>
            </Show>
          }</For>
        </div>
      }</For>
    </div>
  );
}