import { For, Show, type Setter, type Accessor } from "solid-js"
import type { Referral } from "../../server/domain/referral.ts"
import type { Reply } from "../../server/domain/reply.ts"
import { table } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
    replies: Accessor<Referral[]>
    modifyData: ()=>void
    setReply: Setter<Reply>
    newReply: (ref: Referral)=>void
}

export function ListArea(props: Props) {
  function handleClick(reply: Reply){
    if(reply){
      props.setReply(reply);
      props.modifyData();
    }
  }

  function isDone(referral: Referral): boolean {
    return referral.replies.some(reply=>reply.classification==="最終")
  }


  return (
    <div class={ table({ size: "full" }) }>
      <table>
        <thead>
          <tr>
            <th>日付、施設</th><th>科、医師</th><th>返事</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.replies()}>{(referral)=>(
            <tr>
              <td class={ css({ maxWidth: "30%", width: "30%" }) }>
                <div>{referral.date}</div>
                <div><span class={ css({ fontFamily: "number" }) }>{referral.facility.id}:</span>{referral.facility.name}</div></td>
              <td class={ css({ maxWidth: "20%", width: "20%" }) }><div>{referral.department.name}</div><div>{referral.dr.name}</div></td>
              <td class={ styles }>
                <div>
                  <button type="button" onClick={()=>{props.newReply(referral)}} disabled={isDone(referral)}
                    class={ isDone(referral)? disableButton : button }>
                    {isDone(referral)?"完了":"作成"}</button>
                </div>
                <div class={ css({ marginLeft: "1rem", flexGrow: "1" }) }>
                  <For each={referral.replies}>{rep=>
                    <Show when={rep.id}>
                      <div class={ replyStyles } onClick={()=>{handleClick(rep)}}>
                        <span>{rep.classification}</span><span>{rep.date}</span>
                        <span>{rep.department.name}：{rep.dr.name}</span>
                      </div>
                    </Show>
                  }</For>
                </div>
              </td>
            </tr>)
          }</For>
        </tbody>
      </table>
    </div>
  );
}

const styles = css({
  verticalAlign: "top",
  minWidth: "50%",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
});

const replyStyles = css({
  borderTop: "1px solid",
  borderTopColor: "table.border",
  cursor: "pointer",
  width: "100%",

  _hover: {
    backgroundColor: "table.selected",
    transition: "0.5s",
  },

  "&:first-child": {
    border: "none!",
  },

  "& span": {
    marginRight: "1rem",
  }
});

const commonButton = {
  border: "none",
  borderRadius: "3px",
  padding: " 0 0.2rem 0.1rem 0.2rem",
  fontSize: "1.1rem",
};

const button = css(commonButton, {
  cursor: "pointer",
  backgroundColor: "primary",
  color: "white",

  _hover: {
    backgroundColor: "primary.hover",
    transition: "0.5s",
  },
});

const disableButton = css(commonButton, {
  backgroundColor: "#c2c2c2",
  color: "black",
  cursor: "not-allowed",
});