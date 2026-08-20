import { getWeekName, toDate, toLocalDateString } from "../../lib/datetime.ts"
import type { Appointment } from "../../server/domain/appointment.ts"
import { css, sva } from "../../styled-system/css/"

type Props = {
    appointment: Appointment | undefined
}

export function DoneBase(props: Props) {
  function getDateString(date: string|undefined): string{
    if(date){
      const d = toLocalDateString(toDate(date));
      const w = getWeekName(date);
      return `${d}(${w})`;
    }else{
      return "";
    }
  }

  return (
    <div id="report-body" class={ styles.root }>
    <section class={ css({ margin: "2rem" }) }>
      <div class={ styles.heading }>
        <div>　</div>
        <div>
          <h1 class={ css({ fontSize: "3rem", margin: "0!" }) }>受 診 報 告</h1>
        </div>
        <div class={ css({ textAlign: "right", fontFamily: "number" }) }>{toLocalDateString(new Date())}</div>
      </div>
      <div class={ styles.facility }>
        <div>
          <div>{props.appointment?.facility.name}</div>
          <div>{props.appointment?.facilityDr} 先生侍史</div>
          <div>FAX: {props.appointment?.facility.fax}</div>
        </div>
      </div>

      <div class={ styles.message }>
        <div>
          この度は、ご紹介いただきありがとうございました。
        </div>
        <div>
          下記の通り、紹介患者を診察しましたので、ご連絡いたします。
        </div>
        <div>
          詳細については、後日担当医師よりご報告いたしますので、よろしくお願いいたします。
        </div>
      </div>
    </section>
    <section class={ css({ margin: "0 2rem", fontSize: "1.4rem" }) }>
      <div class={ styles.patient }>
        <div class={ css({ fontSize: "1.2rem" }) }>
          <span class={ css({ marginRight: "1rem" }) }>患者No</span>
          {props.appointment?.patient.id}
        </div>
        <div class={ css({ fontSize: "1.6rem" }) }>
          <span class={ css({ marginRight: "1rem" }) }>患者氏名</span>
          {props.appointment?.patient.lastName + "　" + props.appointment?.patient.firstName} 様</div>
      </div>
      <div class={ css({ margin: "2rem 0" }) }>
        <div class={ css({ fontSize: "1.8rem" }) }>
          受診日
        </div>
        <div class={ styles.content }>
          <div>
            <div>{getDateString(props.appointment?.date)}</div>
          </div>
        </div>
      </div>
      <div class={ styles.dept }>
        <div><span>診療科</span>{props.appointment?.department.name}</div>
        <div><span>担当医師</span>{props.appointment?.appDisplay}</div>
      </div>
    </section>
    <section class={ css({ margin: "3rem 2rem 0 2rem", fontSize: "1.3rem" }) }>
      <div class={ styles.message }></div>

      <div class={ styles.hospitalInfo }>
        <div>
          <div>〇〇病院</div>
          <div>地域連携室</div>
          <div class={ css({ fontFamily: "number" }) }>TEL:03-1234-5678</div>
        </div>
      </div>
    </section>
    </div>
  );
}

const styles = sva({
  slots: ["root", "heading", "facility", "message",
    "patient", "content", "dept", "hospitalInfo"],
  base: {
    root: {
      minWidth: "760px",
      maxWidth: "760px",
      minHeight: "1000px",
      maxHeight: "1000px",
      margin: "1rem",
    },
    heading: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      textAlign: "center",
      "& div": {
          width: "calc(100% / 3)",
      }
    },
    facility: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: "1.5rem",
      marginBottom: "1rem",
    },
    message: {
      marginTop: "2rem",
      marginBottom: "2rem",
      fontSize: "1.3rem",
    },
    patient: {
      borderBottom: "2px solid black",
      "&span": {
        display: "inline-block",
        width: "8rem",
      }
    },
    content: {
      display: "flex",
      flexDirection: " row",
      justifyContent: "center",
      fontSize: "2.5rem",
      padding: "1.2rem",
      margin: "0",
      border: "3px solid black",
    },
    dept: {
      marginTop: "3rem",
      "& div": {
        borderBottom: "2px solid black",
        marginBottom: "px.10",
      },
      "& span": {
        display: "inline-block",
        width: "7rem",
        marginRight: "1rem",
      }
    },
    hospitalInfo: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "right",
      fontSize: "1.6rem",
      marginTop: "2rem",
    }
  }
})();