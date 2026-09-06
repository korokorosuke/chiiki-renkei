import { createSignal, Switch, Match } from "solid-js"
import Header from "../-header.tsx"
import { Multi } from "./-multi.tsx"
import { Classification } from "./-classification.tsx"
import { Dr } from "./-dr.tsx"
import { Due } from "./-due.tsx"
import { Department } from "./-department.tsx"
import { Notice } from "./-notice.tsx"
import { WebDepartment } from "./-webDepartment.tsx"
import { WebDr } from "./-webDr.tsx"
import { WebReservation } from "./-webReservation.tsx"
import { WebMaster } from "./-webMaster.tsx"
import { WebNotice } from "./-webNotice.tsx"
import { Questionnaire } from "./-questionnaire.tsx"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import { input, area } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/master/")({ component: App });

function App() {
  const [id, setId] = createSignal<string>("");

  const context = Route.useRouteContext();
  const { user } = context();

  function setMessage(status: MessageStatus): void{
    setStatusMessage(status);
  }


  return (
    <>
    <Header title="マスター登録" visible={false} handler={()=>{}} auth={user} />
    <main>
      <div class={ area({ type: "search" })}>
        <label>種類
          <select value={id()} class={ input({ size: "rem12", space: "left1" }) }
              onChange={(e)=>setId(e.target.value)}>
            <option value=""></option>
            <option value="kind">病院属性</option>
            <option value="post">職員役職</option>
            <option value="facdept">施設診療科</option>
            <option value="means">紹介方法</option>
            <option value="classification">返事区分</option>
            <option value="dept">診療科</option>
            <option value="dr">医師</option>
            <option value="due">問合せ期限</option>
            <option value="purpose">活動目的</option>
            <option value="notice">お知らせ</option>
            <option value="webdept">Web予約診療科</option>
            <option value="webdr">Web予約医師</option>
            <option value="webmaster">Web予約枠テンプレート</option>
            <option value="webreserv">Web予約枠</option>
            <option value="webnotice">Webお知らせ</option>
            <option value="questionnaire">Web問診</option>
          </select>
        </label>
      </div>
      <hr />
      <Switch>
      <Match when={id() === "kind" || id() === "post" || id() === "facdept" ||
        id() === "means" || id() === "purpose"}>
        <Multi id={id()} setMessage={setMessage} />
      </Match>
      <Match when={id() === "classification"}>
        <Classification setMessage={setMessage} />
      </Match>
      <Match when={id() === "dept"}>
        <Department setMessage={setMessage} />
      </Match>
      <Match when={id() === "dr"}>
        <Dr setMessage={setMessage} />
      </Match>
      <Match when={id() === "due"}>
        <Due setMessage={setMessage} />
      </Match>
      <Match when={id() === "notice"}>
        <Notice setMessage={setMessage} />
      </Match>
      <Match when={id() === "webdept"}>
        <WebDepartment setMessage={setMessage} />
      </Match>
      <Match when={id() === "webdr"}>
        <WebDr setMessage={setMessage} />
      </Match>
      <Match when={id() === "webmaster"}>
        <WebMaster setMessage={setMessage} />
      </Match>
      <Match when={id() === "webreserv"}>
        <WebReservation setMessage={setMessage} />
      </Match>
      <Match when={id() === "webnotice"}>
        <WebNotice setMessage={setMessage} />
      </Match>
      <Match when={id() === "questionnaire"}>
        <Questionnaire setMessage={setMessage} />
      </Match>
      </Switch>
      <Message />
    </main>
    <footer>

    </footer>
    </>
  );
}