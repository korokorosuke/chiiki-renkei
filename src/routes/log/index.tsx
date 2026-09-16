import { createSignal, Show, onMount } from "solid-js"
import { ListArea } from "./-listArea.tsx"
import { getList } from "../../server/func/log.ts"
import Header from "../-header.tsx"
import { type Log, initialize } from "../../server/domain/log.ts"
import { css, cx } from "../../styled-system/css/"
import { button, input, area, etc } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"
import { NormalDialog, showDialog } from "../../components/NormalDialog.tsx"

export const Route = createFileRoute("/log/")({ component: App });

function App() {
  const [level, setLevel] = createSignal<string>("");
  const [fromDate, setFromDate] = createSignal<string>("");
  const [toDate, setToDate] = createSignal<string>("");
  const [userId, setUserId] = createSignal<string>("");
  const [patientId, setPatientId] = createSignal<string>("");
  const [selected, setSelected] = createSignal<Log>(initialize());
  const [logs, setLogs] = createSignal<Log[]>([]);

  const context = Route.useRouteContext();
  const { user } = context();

  let refInput: HTMLInputElement | undefined;

  function select(log: Log){
    setSelected(log);
    showDialog();
  }

  async function execute(){
    const res = await getList({data: {
      level: level(), fromDate: fromDate(), toDate: toDate(),
      userId: userId(), patientId: patientId()}});
    setLogs(res);
  }

  async function handleSearch(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute();
    }
  }

  onMount(() => {
    if(refInput){
      refInput.focus();
    }
  });


  return (
    <>
    <Header title="ログ検索" visible={false} handler={()=>{}} auth={user} />
    <main>
      <div class={ area({ type: "search" }) }>
        <div>
          <label><div>日付開始<span class={ etc( { type: "require" }) }>*</span></div><input type="date" value={fromDate()}
            class={ input({ size: "search" }) } ref={refInput}
            onChange={(e)=>setFromDate(e.target.value)}
            onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
          <label><div>日付終了</div><input type="date" value={toDate()}
            class={ input({ size: "search" }) }
            onChange={(e)=>setToDate(e.target.value)}
            onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
          <label><div>ログレベル</div><input type="text" value={level()}
            class={ input({ size: "search" }) }
            onChange={(e)=>setLevel(e.target.value)}
            onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
          <label><div>ユーザーID</div><input type="text" value={userId()}
            class={ input({ size: "search" }) }
            onChange={(e)=>setUserId(e.target.value)}
            onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
          <label><div>患者ID</div><input type="text" value={patientId()}
            class={ input({ size: "search" }) }
            onChange={(e)=>setPatientId(e.target.value)}
            onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
          <button type="button" class={ button({ color: "normal", size: "slim" }) }
            onClick={async ()=>{await execute()}}>検索</button>
        </div>
      </div>
      <hr />
      <Show when={logs().length>0}>
      <ListArea logs={logs} select={select} />
      </Show>
      <NormalDialog>
        <div>
          <div><label>レベル</label></div>
          <div class={ style }>{selected().level}</div>
          <div><label>日時</label></div>
          <div class={ style }>{selected().datetime}</div>
          <div><label>タイトル</label></div>
          <div class={ style }>{selected().title}</div>
          <div><label>詳細</label></div>
          <div class={ cx(css({ whiteSpace: "pre-wrap" }), style) }>{selected().details}</div>
          <div><label>ユーザーID</label></div>
          <div class={ style }>{selected().userId ?? "　"}</div>
          <div><label>患者ID</label></div>
          <div class={ style }>{selected().patientId ?? "　"}</div>
        </div>
      </NormalDialog>
    </main>
    <footer>

    </footer>
    </>
  );
}

const style = css({
  border: "solid 1px black",
  padding: "1px 10px"
});