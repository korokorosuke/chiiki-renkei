import { Show } from "solid-js"
import { getAge } from "../lib/datetime.ts"
import type { Patient } from "../server/domain/patient.ts"
import { sva } from "../styled-system/css/"

type PatientProps = {
  patient: Patient
}

export function PatientArea(props: PatientProps){
  return (
  <Show when={props.patient.id}>
    <div class={ styles.root }>
      <div>
        <div class={ styles.id }>{props.patient.id}</div>
      </div>
      <div>
        <div class={ styles.kana }>{props.patient.lastKana + "　" + props.patient.firstKana}</div>
        <div class={ styles.name }>{props.patient.lastName + "　" + props.patient.firstName}</div>
      </div>
      <div>
        <div class={ styles.line }>
          <div class={ styles.birth }>{props.patient.birthday.replace("-","年").replace("-","月")+"日生"}
            ({getAge(props.patient.birthday, new Date())}歳)</div>
          <div class={ styles.sex }>{props.patient.sex===0?"男":"女"}</div>
        </div>
        <div>{props.patient.address.name+props.patient.address.plus}</div>
      </div>
    </div>
  </Show>
  );
}

const styles = sva({
  slots: ["root", "line", "id", "name", "kana", "birth", "sex"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      paddingBottom: "px.5",
      backgroundColor: "subinfo",

      "& > div": {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginRight: "1rem",
      },
    },
    line: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      "& div": {
        marginRight: "1rem",
      }
    },
    id: {
      minWidth: "5rem",
      fontFamily: "number",
    },
    name: {
      fontSize: "1.5rem",
      minWidth: "10rem",
    },
    kana: {
      fontSize: "1rem",
    },
    birth: {
      fontFamily: "number",
    },
    sex: {},
  }
})();