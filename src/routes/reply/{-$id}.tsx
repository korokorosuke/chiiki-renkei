import { createSignal, Switch, Match } from "solid-js"
import Header from "../-header.tsx"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { getReply as getServerRep, getReplies as getServerReps } from "../../server/func/reply.ts"
import { PatientArea } from "../../components/PatientArea.tsx"
import { Authenticator, authenticatedUser as user } from "../../components/Authenticator.tsx"
import { initPatient, initReply, toUser } from "../../helper/types.ts"
import { getAllClassifications } from "../../server/func/classification.ts"
import { getDepartments } from "../../server/func/department.ts"
import { getPatient } from "../../server/func/patient.ts"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import type { Reply } from "../../server/domain/reply.ts"
import type { Referral } from "../../server/domain/referral.ts"
import type { Patient } from "../../server/domain/patient.ts"
import type { Department } from "../../server/domain/department.ts"
import type { Classification } from "../../server/domain/classification.ts"

import { button, input, area } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/reply/{-$id}")({ component: App });

let refInput: HTMLInputElement | undefined;

function App() {
  const [id, setId] = createSignal<string>("");
  const [selected, setSelected] = createSignal<Reply>(initReply());
  const [replies, setReplies] = createSignal<Referral[]>([]);
  const [modification, setModification] = createSignal<boolean>(false);
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [message, setMessage] = createSignal<string>("");
  const [patient, setPatient] = createSignal<Patient>(initPatient());
  const [depts, setDepts] = createSignal<Department[]>([]);
  const [classes, setClasses] = createSignal<Classification[]>([]);

  const params = Route.useParams();
  const paramId = params().id;

  async function terminateModification(status: MessageStatus): Promise<void>{
    setModification(false);
    setStatusMessage(status);
    if(patient().id){
      await getReplies(patient());
    }
  }

  function select(){
    setModification(true);
    setNewadd(false);
  }

  async function move(id: string){
    if(id){
      await loadData(id);
    }else{
      setMessage("患者を入力してください");
    }
  }

  async function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      await move(id());
    }
  }

  function handleNew(ref: Referral){
    setModification(false);
    setSelected({
      ...initReply(),
      refId: ref.id,
      personInCharge: toUser(user()),
    });
    setNewadd(true);
    setModification(true);
  }

  async function loadData(id: string){
    setModification(false);
    if(id != ""){
      const pat = await getPatient({data: {id}});
      if(pat){
        setId("");
        setPatient(pat);
        setMessage("");
        await getReplies(pat);
      }else{
        setPatient(initPatient());
        setMessage("患者がみつかりませんでした");
        setReplies([]);
        if(refInput){
          refInput.select();
          refInput.focus();
        }
      }
    }
  }

  async function getReplies(pat: Patient){
    const res = await getServerReps({data: {patientId: pat.id}});
    setReplies(res);
  }

  async function getReply(id: string){
    const res = await getServerRep({data: {id}});
    if(res && res.replies.length === 1){
      setPatient(res.patient);
      setSelected(res.replies[0]);
      setModification(true);
      setNewadd(false);
    }
  }

  async function initialize(){
    getDepartments().then(setDepts);
    getAllClassifications().then(setClasses);
    if(refInput){
      refInput.focus();
    }
    if(paramId && paramId.length < 20){
      await loadData(paramId);
    }else if(paramId){
      await getReply(paramId);
    }
  }


  return (
    <>
    <Authenticator initializer={initialize} />
    <Header title="返事登録" visible={false} handler={()=>{}} auth={user} />
    <main>
      <div class={ area({ type: "search" })}>
        <label>患者ID<input type="text" class={ input({ size: "first", space: "first" }) }
          value={id()}
          onChange={(e)=>setId(e.target.value)}
          onKeyUp={(e)=>handleChange(e)} ref={refInput} /></label>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={()=>{move(id())}}>検索</button>
        <span>{message()}</span>
      </div>
      <hr />
      <PatientArea patient={patient()} />
      <Switch fallback={<div></div>}>
        <Match when={modification()}>
          <ModificationArea auth={user}
            reply={selected} setReply={setSelected} newadd={newadd}
            classes={classes()}
            depts={depts()} terminateModification={terminateModification} />
        </Match>
        <Match when={replies().length > 0}>
          <ListArea replies={replies} select={select}
            setReply={setSelected} newReply={handleNew} />
        </Match>
      </Switch>
      <Message />
    </main>
    <footer>

    </footer>
    </>
  );
}