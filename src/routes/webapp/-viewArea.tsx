import { Show, Switch, Match } from "solid-js"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import { css } from "../../styled-system/css/"

type Props = {
  selected: WebAppointment
}

export function ViewArea(props: Props){

  return (
    <>
      <div class={ css({ width: "100%", marginTop: "px.10" }) }>
      <table class={ styles }>
        <tbody>
        <Switch>
          <Match when={props.selected.cancel}>
            <tr>
              <th>状態</th>
              <td class={ css({ color: "red" }) }>キャンセル</td>
            </tr>
          </Match>
          <Match when={!props.selected.date&&props.selected.consultation}>
            <tr>
              <th>状態</th>
              <td class={ css({ color: "red" }) }>調整中</td>
            </tr>
          </Match>
        </Switch>
        <tr>
          <th>診療科</th>
          <td>{props.selected.department.name}</td>
        </tr>
        <Show when={props.selected.date}>
        <tr>
          <th>予約医師</th>
          <td>{props.selected.dr.displayName}</td>
        </tr>
        <tr>
          <th>予約日時</th>
          <td>{props.selected.date} {props.selected.time}</td>
        </tr>
        </Show>
        <Show when={!props.selected.date}>
          <tr>
            <th>予約希望</th>
            <td>
              <table class={ noBorder }>
                <tbody>
                  <Show when={props.selected.consultation?.first}>
                  <tr>
                  <td>第一希望：{props.selected.consultation?.first}</td>
                  </tr>
                  </Show>
                  <Show when={props.selected.consultation?.second}>
                  <tr>
                  <td>第二希望：{props.selected.consultation?.second}</td>
                  </tr>
                  </Show>
                  <tr>
                  <td>{props.selected.consultation?.etc}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </Show>
        <tr>
          <th>患者ID</th>
          <td>{props.selected.patient.id}</td>
        </tr>
        <tr>
          <th>氏名</th>
          <td>
            {props.selected.patient.lastName}　{props.selected.patient.firstName}
          </td>
        </tr>
        <tr>
          <th>カナ</th>
          <td>
            {props.selected.patient.lastKana}　{props.selected.patient.firstKana}
          </td>
        </tr>
        <tr>
          <th>生年月日</th>
          <td>{props.selected.patient.birthday}</td>
        </tr>
        <tr>
          <th>性別</th>
          <td>{props.selected.patient.sex===0?"男":"女"}</td>
        </tr>
        <tr>
          <th>連絡先</th>
          <td>{props.selected.patient.tel}</td>
        </tr>
        <tr>
          <th>郵便番号</th>
          <td>{props.selected.patient.address.postalCode}</td>
        </tr>
        <tr>
          <th>住所</th>
          <td>{props.selected.patient.address.name}{props.selected.patient.address.plus}</td>
        </tr>
        <tr>
          <th>紹介目的</th>
          <td>{props.selected.mainComplaint}</td>
        </tr>
        </tbody>
      </table>
      </div>
    </>
  );
}

const noBorder = css({
  border: "none!",
  "& th": {
    border: "none!",
  },
  "& td": {
    border: "none!",
    paddingLeft: "0",
    paddingRight: "0",
  },
  "& tr": {
    border: "none!",
  },
});


const styles = css({
  width: "100%",
  border: "1px solid",
  borderColor: "container.border",
  borderCollapse: "collapse",
  paddingTop: "px.5",
  paddingBottom: "px.5",
  paddingRight: "px.10",
  paddingLeft: "px.10",

  "& th, td": {
    textAlign: "left",
    paddingTop: "px.5",
    paddingBottom: "px.5",
    paddingRight: "px.10",
    paddingLeft: "px.10",
    border: "1px solid",
    borderColor: "container.border",
  },

  "& th": {
    width: "10rem",
    padding: "0.7rem",
    backgroundColor: "web.title",
    fontWeight: "normal",
  },

  "& td": {
    whiteSpace: "pre-wrap",
  }
});