import { createSignal, Switch, Match } from "solid-js"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import Header from "../-header.tsx"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import { toDateString, addDays } from "../../lib/datetime.ts"
import { initActivity } from "../../helper/types.ts"
import type { Activity } from "../../server/domain/activity.ts"
import { getActivities } from "../../server/func/activity.ts"
import { button, area, input } from "../../styled-system/recipes/"
import { css, cx } from "../../styled-system/css/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/activity/")({ component: App });

function App() {
  const [selected, setSelected] = createSignal<Activity>(initActivity());
  const [inputFacData, setInputFacData] = createSignal<string>("");
  const [inputFromData, setInputFromData] = createSignal<string>("");
  const [inputToData, setInputToData] = createSignal<string>("");
  const [activities, setActivities] = createSignal<Activity[]>([]);
  const [modification, setModification] = createSignal<boolean>(false);
  const [newadd, setNewadd] = createSignal<boolean>(false);

  const context = Route.useRouteContext();
  const { user } = context();

  async function terminateModification(status: MessageStatus): Promise<void>{
    setModification(false);
    setStatusMessage(status);

    await loadData(inputFacData(), inputFromData(), inputToData());
  }

  function select(act: Activity){
    setActivities([]);
    setSelected(act);
    setNewadd(false);
    setModification(true);
  }

  function handleNew(){
    setModification(false);
    setSelected(initActivity());
    setModification(true);
    setNewadd(true);
  }

  async function execute(){
    setModification(false);
    await loadData(inputFacData(), inputFromData(), inputToData());
  }

  async function handleSearch(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute();
    }
  }

  async function loadData(facid: string, fromdate: string, todate: string){
    if(!facid && !fromdate && !todate){
      const today = new Date();
      const start = addDays(today, -14);
      fromdate = toDateString(start);
      todate = toDateString(today);
    }
    if(facid || fromdate || todate){
      const s = await getActivities({data: {facilityId: facid, fromDate: fromdate, toDate: todate}});
      setActivities(s);
    }
  }

  return (
    <>
    <Header title="活動記録" visible handler={handleNew} auth={user} />
    <main>
      <div class={ area({ type: "search" }) }>
        <div>
        <label><div>施設ID</div><input type="text" class={ input({ size: "search" }) }
          value={inputFacData()}
          onChange={(e)=>setInputFacData(e.target.value)}
          onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
        <label><div>日付from</div><input type="date" class={ input({ size: "search" }) }
          value={inputFromData()}
          onChange={(e)=>setInputFromData(e.target.value)}
          onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
        <label><div>日付to</div><input type="date" class={ input({ size: "search" }) }
          value={inputToData()}
          onChange={(e)=>setInputToData(e.target.value)}
          onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
        <button type="button" class={ cx(css({ marginTop: "1.4rem" }), button({ color: "normal", size: "slim" })) }
          onClick={async ()=>{await execute()}}>検索</button>
        </div>
      </div>
      <hr />
      <Switch>
        <Match when={modification()}>
          <ModificationArea auth={user}
            terminateModification={terminateModification} newadd={newadd}
            selected={selected} setSelected={setSelected} />
        </Match>
        <Match when={activities().length > 0}>
          <ListArea activities={activities} select={select} />
        </Match>
      </Switch>
      <Message />
    </main>
    <footer>

    </footer>
    </>
  );
}