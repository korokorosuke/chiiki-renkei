import { createSignal, Switch, Match } from "solid-js"
import Header from "../-header.tsx"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { PatientArea } from "../../components/PatientArea.tsx"
import { Authenticator, authenticatedUser as user } from "../../components/Authenticator.tsx"
import { initPatient, initAppointment, toUser } from "../../helper/types.ts"
import { getAppointment, getAppointments as getServerApps } from "../../server/func/appointment.ts"
import { getDepartments } from "../../server/func/department.ts"
import { getPatient } from "../../server/func/patient.ts"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import type { Appointment } from "../../server/domain/appointment.ts"
import type { Patient } from "../../server/domain/patient.ts"
import type { Department } from "../../server/domain/department.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/appointment/{-$patientId}/{-$appId}")({
  component: App,
  loader: async ({ params: { patientId, appId } }) => {
    let ok = true;
    const depts = getDepartments();
    if(appId && patientId){
      let patient: Patient|undefined;
      const app = await getAppointment({data: {id: appId}});
      if(!app){
        patient = await getPatient({ data: { id: patientId } });
        ok = false;
      }else{
        patient = app.patient;
      }
      return { ok, depts, app, patient, appId, patientId };
    }else if(patientId){
      const patient = await getPatient({ data: { id: patientId } });
      if(!patient){
        ok = false;
      }
      return { ok, depts, app: undefined, patient, appId, patientId };
    }
    return { ok: false, depts, app: undefined, patient: undefined, appId, patientId };
  },
  head: ({ loaderData })=>({
    meta: [
      {
        title: loaderData && loaderData.ok && loaderData.patient ?
          `${loaderData.patient.id} - ${loaderData.patient.lastName}　${loaderData.patient.firstName}　[紹介登録]　地域連携システム` :
          "[紹介登録]　地域連携システム"
      }
    ],
    scripts: [ { src: "/html2pdf.js" }, ],
  }),
});

let refInput: HTMLInputElement | undefined;

function App() {
  const [id, setId] = createSignal<string>("");
  const [selected, setSelected] = createSignal<Appointment>(initAppointment());
  const [appointments, setAppointments] = createSignal<Appointment[]>([]);
  const [modification, setModification] = createSignal<boolean>(false);
  const [visible, setVisible] = createSignal<boolean>(false);
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [message, setMessage] = createSignal<string>("");
  const [patient, setPatient] = createSignal<Patient>(initPatient());
  const [depts, setDepts] = createSignal<Department[]>([]);

  const loaderData = Route.useLoaderData();

  async function terminateModification(status: MessageStatus): Promise<void>{
    setModification(false);
    setVisible(true);
    setStatusMessage(status);
    if(patient().id){
      await getAppointments(patient());
    }
  }

  function select(){
    setSelected(s=>{s.patient=patient();return s});
    setModification(true);
    setNewadd(false);
  }

  function move(patId: string){
    if(patId){
      location.href = `/appointment/${patId}`;
    }else{
      setMessage("患者を入力してください");
    }
  }

  function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      move(id());
    }
  }

  function handleNew(pat: Patient|undefined){
    setModification(false);
    setSelected({
      ...initAppointment(),
      patient: (pat ?? patient()),
      personInCharge: toUser(user()),
    });
    setNewadd(true);
    setModification(true);
  }

  async function getAppointments(pat: Patient){
    const data = await getServerApps({data: {patientId: pat.id}});
    setVisible(true);
    const list = data.sort((v1,v2)=>{
      if(v1.date > v2.date){
        return -1;
      }else if(v1.date < v2.date){
        return 1;
      }else{
        return 0;
      }
    });
    setAppointments(list);
    if(list.length === 0){
      handleNew(pat);
    }
  }

  async function initialize(){
    const {ok, depts, app, patient, patientId} = loaderData();
    depts.then(setDepts);
    if(ok && app){
      setSelected(app);
      setPatient(app.patient);
      setModification(true);
    }else if(ok && patient){
      setPatient(patient);
      await getAppointments(patient);
    }else if(!ok){
      if(patient){
        setPatient(patient);
        await getAppointments(patient);
        setMessage("紹介データがみつかりませんでした")
      }else if(patientId){
        setMessage("患者がみつかりませんでした");
        setId(patientId);
        if(refInput){
          refInput.select();
        }
      }
    }
    if(refInput){
      refInput.focus();
    }
  }


  return (
    <>
    <Authenticator initializer={initialize} />
    <Header title="紹介予約" visible={visible()} handler={()=>handleNew(patient())} auth={user} />
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
            appointment={selected} setAppointment={setSelected} newadd={newadd}
            depts={depts()} terminateModification={terminateModification} />
        </Match>
        <Match when={appointments().length > 0}>
          <ListArea appointments={appointments} select={select}
            setAppointment={setSelected} />
        </Match>
      </Switch>
      <Message />
    </main>
    <footer>

    </footer>
    </>
  );
}