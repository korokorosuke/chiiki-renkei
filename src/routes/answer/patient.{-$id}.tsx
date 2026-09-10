import { createSignal, Show, onMount } from "solid-js"
import type { Answer } from "../../server/domain/answer.ts"
import Header from "../-header.tsx"
import { ListArea } from "./-listArea.tsx"
import { ViewArea } from "./-viewArea.tsx"
import { PatientArea } from "../../components/PatientArea.tsx"
import type { Patient } from "../../server/domain/patient.ts"
import { getPatient } from "../../server/func/patient.ts"
import { getAnswersByPatient } from "../../server/func/answer.ts"
import { initPatient, initAnswer } from "../../helper/types.ts"
import { area, input, button } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/answer/patient/{-$id}")({
  component: App,
  loader: async ({ params: { id } }) => {
    if(id){
      const patient = await getPatient({ data: { id } });
      if(patient){
        return { ok: true, patient, id };
      }else{
        return { ok: false, patient: undefined, id };
      }
    }
    return { ok: false, patient: undefined, id: undefined };
  },
  head: ({ loaderData })=>({
    meta: [
      {
        title: loaderData && loaderData.ok && loaderData.patient ?
          `${loaderData.patient.id} - ${loaderData.patient.lastName}　${loaderData.patient.firstName}　[問診閲覧]　地域連携システム` :
          "[問診閲覧]　地域連携システム"
      }
    ]
  }),
});

let refInput: HTMLInputElement | undefined;

function App() {
  const [id, setId] = createSignal("");
  const [answers, setAnswers] = createSignal<Answer[]>([]);
  const [message, setMessage] = createSignal<string>("");
  const [patient, setPatient] = createSignal<Patient>(initPatient());
  const [selected, setSelected] = createSignal<Answer>(initAnswer());

  const loaderData = Route.useLoaderData();
  const context = Route.useRouteContext();
  const { user } = context();

  function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      move(id());
    }
  }

  function move(id: string){
    if(id){
      location.href = `/answer/patient/${id}`;
    }else{
      setMessage("患者を入力してください");
    }
  }

  function select(answer: Answer){
    setAnswers([]);
    setSelected(answer);
  }

  function displayList(){
    setSelected(initAnswer());
  }

  onMount(async () => {
    const { ok, patient, id } = loaderData();
    if(ok && patient){
      setPatient(patient);
      setAnswers(await getAnswersByPatient({data: { patientId: patient.id }}));
    }else if(!ok && id){
      setId(id);
      setMessage("患者が見つかりませんでした");
      if(refInput){
        refInput.select();
      }
    }
    if(refInput){
      refInput.focus();
    }
  });


  return (
    <>
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

      <Show when={answers().length > 0 || (selected().id === "" && patient().lastName)}>
        <ListArea select={select} answers={answers} />
      </Show>
      <Show when={selected().id !== ""}>
        <ViewArea selected={selected()} displayList={displayList} />
      </Show>
    </main>
    </>
  );
}