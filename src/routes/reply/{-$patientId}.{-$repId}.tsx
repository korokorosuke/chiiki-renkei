import { createSignal, Switch, Match } from "solid-js"
import Header from "../-header.tsx"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { getReply, getReplies as getServerReps } from "../../server/func/reply.ts"
import { PatientArea } from "../../components/PatientArea.tsx"
import { Authenticator, authenticatedUser as user } from "../../components/Authenticator.tsx"
import { initPatient, initReply, initReferral, toUser } from "../../helper/types.ts"
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

export const Route = createFileRoute("/reply/{-$patientId}/{-$repId}")({
  component: App,
  loader: async ({ params: { patientId, repId } }) => {
    const depts = getDepartments();
    if(repId){
      let ref = await getReply({data: {id: repId}});
      if(!ref){
        ref = initReferral();
        ref.id = repId;
      }
      return { depts, ref };
    }else if(patientId){
      const ref = initReferral();
      const patient = await getPatient({ data: { id: patientId } });
      if(patient){
        ref.patient = patient;
      }else{
        ref.patient.id = patientId;
      }
      return { depts, ref };
    }
    return { depts, ref: undefined };
  },
  head: ({ loaderData })=>({
    meta: [
      {
        title: loaderData && loaderData.ref && loaderData.ref.patient.firstName ?
          `${loaderData.ref.patient.id} - ${loaderData.ref.patient.lastName}　${loaderData.ref.patient.firstName}　[返事登録]　地域連携システム` :
          "[返事登録]　地域連携システム"
      }
    ]
  }),
});

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

  const loaderData = Route.useLoaderData();

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

  function move(patId: string){
    if(patId){
      location.href = `/reply/${patId}`;
    }else{
      setMessage("患者を入力してください");
    }
  }

  function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      move(id());
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

  async function getReplies(pat: Patient){
    const res = await getServerReps({data: {patientId: pat.id}});
    setReplies(res);
  }

  async function initialize(){
    getAllClassifications().then(setClasses);
    const {depts, ref} = loaderData();
    depts.then(setDepts);
    if(ref && ref.replies.length === 1){
      setSelected(ref.replies[0]);
      setPatient(ref.patient);
      setModification(true);
      setNewadd(false);
    }else if(ref && ref.patient.id){
      if(ref.patient.firstName){
        setPatient(ref.patient);
        await getReplies(ref.patient);
      }else{
        setId(ref.patient.id);
        setPatient(initPatient());
        setMessage("患者がみつかりませんでした");
        setReplies([]);
        if(refInput){
          refInput.select();
        }
      }
      setModification(false);
      setNewadd(false);
    }
    if(refInput){
      refInput.focus();
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