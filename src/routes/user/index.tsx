import { createSignal, Switch, Match } from "solid-js"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { initAuthUser } from "../../helper/types.ts"
import { getAllDepartments } from "../../server/func/department.ts"
import { getAuthUser, getUsers } from "../../server/func/user.ts"
import Header from "../-header.tsx"
import { Authenticator, authenticatedUser as user } from "../../components/Authenticator.tsx"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import type { AuthUser } from "../../server/domain/user.ts"
import type { Department } from "../../server/domain/department.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/user/")({ component: App });

function App() {
  const [inputData, setInputData] = createSignal<string>("");
  const [selected, setSelected] = createSignal<AuthUser>(initAuthUser());
  const [users, setUsers] = createSignal<AuthUser[]>([]);
  const [modification, setModification] = createSignal<boolean>(false);
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [message, setMessage] = createSignal("");
  const [depts, setDepts] = createSignal<Department[]>([]);

  let refInput: HTMLInputElement | undefined;

  function terminateModification(status: MessageStatus): void{
    setModification(false);
    setStatusMessage(status);
    if(status === "register"){
      setUsers([selected()]);
    }
    setSelected(initAuthUser());
  }

  function select(u: AuthUser){
    if(!u.facilityId){
      u.facilityId = "";
    }
    setSelected(u);
    setModification(true);
    setNewadd(false);
  }

  function handleNew(){
    setModification(false);
    setSelected(initAuthUser());
    setModification(true);
    setNewadd(true);
  }

  async function execute(){
    setModification(false);
    setMessage("");
    await loadData(inputData());
  }

  async function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute();
    }
  }

  async function loadData(user: string){
    if(user != ""){
      if(/^[0-9a-z]+$/i.test(user)){
        const res = await getAuthUser({data: {id: user}});
        if(res && res.id){
          setSelected(res);
          setUsers([]);
          setModification(true);
          setNewadd(false);
        }else{
          setMessage("対象データが存在しません");
          setUsers([]);
        }
      }else{
        const res = await getUsers({data: {name: user}});
        if(res && res.length >= 1){
          setUsers(res);
        }else{
          setMessage("対象データが存在しません");
          setUsers([]);
        }
      }
    }
  }

  function initialize(){
    getAllDepartments().then(setDepts);
    if(refInput){
      refInput.focus();
    }
  }


  return (
    <>
    <Authenticator initializer={initialize} />
    <Header title="ユーザー登録" visible handler={handleNew} auth={user} />
    <main>
      <div class={ area({ type: "search" })}>
        <label>ユーザー<input type="text" class={ input({ size: "first", space: "first" }) }
          value={inputData()}
          onChange={(e)=>setInputData(e.target.value)}
          onKeyUp={handleChange} ref={refInput} /></label>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={async ()=>{await execute()}}>検索</button>
        <span>{message()}</span>
      </div>
      <hr />
      <Switch>
        <Match when={modification()}>
          <ModificationArea user={selected} setUser={setSelected} depts={depts()}
            terminateModification={terminateModification} newadd={newadd()} />
        </Match>
        <Match when={users().length > 0}>
          <ListArea users={users} select={select} depts={depts()} />
        </Match>
      </Switch>
      <Message />
    </main>
    <footer>

    </footer>
    </>
  );
}