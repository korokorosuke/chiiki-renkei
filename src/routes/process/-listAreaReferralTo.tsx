import { For, type Accessor } from "solid-js"
import type { AuthUser } from "../../server/domain/user.ts"
import type { ReferralTo } from "../../server/domain/referralto.ts"
import { procStyles, titleStyles } from "./-css.ts"
import { css, cx } from "../../styled-system/css/"

type Props = {
    list: Accessor<ReferralTo[]>
    auth: AuthUser
}

export function ListAreaReferralTo(props: Props) {
  function handleClick(referral: ReferralTo){
    if(props.auth.authReferral>=2){
      location.href = `/referralto/${referral.patient.id}/${referral.id}`;
    }
  }

  return (
    <div>
      <div class={ titleStyles }>逆紹介</div>
      <For each={props.list()}>{(referral)=>
        <div class={ cx(procStyles, css({ marginBottom: "1rem" })) } onClick={()=>handleClick(referral)}>
          <span class={ css({ fontFamily: "number" }) }>{referral.date}</span>
          <span>[{referral.department.name}]</span>
          <span>{referral.dr.name}</span>
          <span><p class={ css({ fontFamily: "number" }) }>{referral.facility.id}</p>:{referral.facility.name}</span>
        </div>
      }</For>
    </div>
  );
}