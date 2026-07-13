import { createSignal, Show } from "solid-js"
import type { Answer } from "../../server/domain/answer.ts"
import Header from "../-header.tsx"
import { ListArea } from "./-listArea.tsx"
import { ViewArea } from "./-viewArea.tsx"
import { PatientArea } from "../../components/PatientArea.tsx"
import type { Patient } from "../../server/domain/patient.ts"
import { getPatient } from "../../server/func/patient.ts"
import { getAnswersByPatient } from "../../server/func/answer.ts"
import { initPatient, initAnswer } from "../../helper/types.ts"
import { Authenticator, authenticatedUser as user } from "../../components/Authenticator.tsx"
import { area, input, button } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/answer/patient/$id")({ component: App });

let refInput: HTMLInputElement | undefined;

function App() {
  const [id, setId] = createSignal("");
  const [answers, setAnswers] = createSignal<Answer[]>([]);
  const [message, setMessage] = createSignal<string>("");
  const [patient, setPatient] = createSignal<Patient>(initPatient());
  const [selected, setSelected] = createSignal<Answer>(initAnswer());

  const params = Route.useParams();
  const paramPatient = params().id;

  async function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      await move(id());
    }
  }

  async function move(id: string){
    if(id){
      await loadData(id);
    }else{
      setMessage("患者を入力してください");
    }
  }

  async function loadData(id: string){
    if(id != ""){
      const pat = await getPatient({data: { id }});
      if(pat){
        setId("");
        setPatient(pat);
        setMessage("");
        setAnswers(await getAnswersByPatient({data: { patientId: pat.id }}));
      }else{
        setPatient(initPatient());
        setMessage("患者がみつかりませんでした");
        setAnswers([]);
        if(refInput){
          refInput.select();
          refInput.focus();
        }
      }
    }
  }

  function select(answer: Answer){
    setSelected(answer);
  }

  function displayList(){
    setSelected(initAnswer());
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
    <Header title="問診一覧" visible={false} handler={()=>{}} auth={user} />
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

      <Show when={selected().id === ""}>
        <ListArea select={select} answers={answers} />
      </Show>
      <Show when={selected().id != ""}>
        <ViewArea selected={selected()} displayList={displayList} />
      </Show>
    </main>
    </>
  );
}