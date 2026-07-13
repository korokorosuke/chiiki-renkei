import { createSignal, Show } from "solid-js"
import { ListAreaReferralTo } from "./-listAreaReferralTo.tsx"
import { ListAreaReply } from "./-listAreaReply.tsx"
import { PatientArea } from "../../components/PatientArea.tsx"
import { Authenticator, authenticatedUser as user } from "../../components/Authenticator.tsx"
import { initPatient } from "../../helper/types.ts"
import { getPatient } from "../../server/func/patient.ts"
import { getReplies } from "../../server/func/reply.ts"
import { getReferralTos } from "../../server/func/referralto.ts"
import type { Patient } from "../../server/domain/patient.ts"
import type { Referral } from "../../server/domain/referral.ts"
import type { ReferralTo } from "../../server/domain/referralto.ts"
import Header from "../-header.tsx"
import { button, input, area } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/process/{-$patient}")({ component: App });

function App() {
  const [inputData, setInputData] = createSignal<string>("");
  const [reply, setReply] = createSignal<Referral[]>([]);
  const [referralTo, setReferralTo] = createSignal<ReferralTo[]>([]);
  const [patient, setPatient] = createSignal<Patient>(initPatient());
  const [message, setMessage] = createSignal<string>("");
  const [repok, setRepok] = createSignal(false);
  const [refok, setRefok] = createSignal(false);

  const params = Route.useParams();
  const paramPatient = params().patient;

  let refInput: HTMLInputElement | undefined;

  function move(id: string){
    if(id){
      location.href = `/process/${id}`;
    }else{
      setMessage("患者を入力してください");
    }
  }

  function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      move(inputData());
    }
  }

  async function loadData(patientid: string){
    if(!patientid){
      return;
    }
    const p = await getPatient({data: {id: patientid}});
    if(p){
      setPatient(p);
    }else{
      setReply([]);
      setReferralTo([]);
      setMessage("患者が存在しません");
      setPatient(initPatient());
      return;
    }
    getReplies({data: {patientId: patientid}}).then(res=>{
      if(res.length !== 0){
        setReply(res);
        setRepok(true);
      }else{
        setReply([]);
        setRepok(true);
      }
    });
    getReferralTos({data: {patientId: patientid}}).then(res=>{
      if(res.length !== 0){
        setReferralTo(res.sort((v1, v2)=>{
          if(v1.date > v2.date){
            return -1;
          }else if(v1.date < v2.date){
            return 1;
          }else{
            return 0;
          }
        }));
        setRefok(true);
      }else{
        setReferralTo([]);
        setRefok(true);
      }
    });
  }

  async function initialize(){
    if(refInput){
      refInput.focus();
    }
    if(paramPatient){
      await loadData(paramPatient);
    }
  }

  return (
    <>
    <Authenticator initializer={initialize} />
    <Header title="紹介状況" visible={false} handler={()=>{}} auth={user} />
    <main>
      <div class={ area({ type: "search" })}>
        <label>患者ID<input type="text" class={ input({ size: "first", space: "first" }) }
          value={inputData()}
          onChange={(e)=>setInputData(e.target.value)}
          onKeyUp={(e)=>handleChange(e)} ref={refInput} /></label>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={()=>{move(inputData())}}>検索</button>
        <span>{message()}</span>
      </div>
      <hr />
      <PatientArea patient={patient()} />
      <Show when={repok()}>
        <ListAreaReply list={reply} auth={user} />
      </Show>
      <Show when={refok()}>
        <ListAreaReferralTo list={referralTo} auth={user} />
      </Show>
    </main>
    <footer>

    </footer>
    </>
  );
}