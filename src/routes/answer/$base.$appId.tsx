import { createSignal, Switch, Match, Show, onMount } from "solid-js"
import { MobileListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { initAnswer } from "../../helper/types.ts"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import type { Answer } from "../../server/domain/answer.ts"
import { exists, getAnswersByPassword } from "../../server/func/answer.ts"
import { button, input } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { token } from "../../styled-system/tokens/"
import { root, menu, item, title } from "../-headerCss.ts"
import { searchError } from "../../styles/common.ts"
import { createFileRoute } from "@tanstack/solid-router"
import { getBase } from "../../server/func/base.ts"

export const Route = createFileRoute("/answer/$base/$appId")({
  component: App,
  loader: async ({ params: { base, appId }}) => {
    if(base && appId){
      const baseData = await getBase({ data: { id: base } })
      return { base, baseData, appId, result: await exists({ data: { appId, base } }) };
    }
    return { base, baseData: undefined, appId, result: false };
  }
});

function App() {
  const [selected, setSelected] = createSignal<Answer>(initAnswer());
  const [answers, setAnswers] = createSignal<Answer[]>([]);
  const [modification, setModification] = createSignal<boolean>(false);
  const [message, setMessage] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [ok, setOk] = createSignal(false);
  const [existsData, setExistsData] = createSignal(false);
  const [loading, setLoading] = createSignal(true);

  const loaderData = Route.useLoaderData();
  const { base, appId, baseData, result } = loaderData();

  function terminateModification(status: MessageStatus): void{
    setModification(false);
    setStatusMessage(status);
    if(status === "register"){
      setAnswers([selected()]);
    }
    setSelected(initAnswer());
  }

  function select(a: Answer){
    setSelected(a);
    setModification(true);
  }

  async function authAndGet(){
    if(!password()){
      setMessage("パスワードを入力してください。")
      return;
    }
    if(base && appId){
      const res = await getAnswersByPassword({ data: { appId, password: password(), base } });
      if(res.ok){
        setMessage("");
        setOk(true);
        setAnswers(res.data ?? []);
      }else{
        setMessage(res.errors![0]);
      }
    }
  }

  onMount(() => {
    setExistsData(result);
    setLoading(false);
  });


  return (
    <>
    <header class={ root }
        /* @ts-ignore */
        style={{"--color": "white", "--color-bg": token(`colors.${baseData.color}`),
        /* @ts-ignore */
        "--color-bg-hover": token(`colors.${baseData.color.replace("600", "500").replace("800", "700")}`)}}>
      <nav class={ menu }>
        <div class={ item }>
          <div class={ title }>問診入力</div>
        </div>
      </nav>
    </header>
    <main>
      <Switch>
        <Match when={loading()}>
          <div>読み込み中です・・・</div>
        </Match>
        <Match when={!appId || !base}>
          <div>
            <div>URLが不正です。</div>
          </div>
        </Match>
        <Match when={!existsData()}>
          <p>問診はありません</p>
        </Match>
        <Match when={!ok() && appId}>
          <div>
            <div>パスワードを入力してください。</div>
            <div>
              <input type="password"
                class={ input({ size: "full" }) }
                value={password()}
                onInput={(e) => setPassword(e.target.value)} />
            </div>
            <div class={ css({ marginTop: "1rem" }) }>
              <button type="button"
                class={ button({ color: "primary", size: "full" }) }
                onClick={authAndGet}>OK</button>
            </div>
          </div>
        </Match>
        <Match when={modification() && ok()}>
          <ModificationArea answer={selected} setAnswer={setSelected}
            terminateModification={terminateModification} base={base!}/>
        </Match>
        <Match when={answers().length > 0 && ok()}>
          <MobileListArea answers={answers} select={select} />
        </Match>
      </Switch>
      <Message />
      <Show when={message() != ""}>
        <div class={ css(searchError) }>{message()}</div>
      </Show>
    </main>
    <footer>

    </footer>
    </>
  );
}