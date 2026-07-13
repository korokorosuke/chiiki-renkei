import { createSignal, Switch, Match } from "solid-js"
import Header from "../-header.tsx"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { PatientArea } from "../../components/PatientArea.tsx"
import { Authenticator, authenticatedUser as user } from "../../components/Authenticator.tsx"
import { initPatient, initAppointment, toUser } from "../../helper/types.ts"
import { getAppointment, getAppointments as getApp } from "../../server/func/appointment.ts"
import { getDepartments } from "../../server/func/department.ts"
import { getPatient } from "../../server/func/patient.ts"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import type { Appointment } from "../../server/domain/appointment.ts"
import type { Patient } from "../../server/domain/patient.ts"
import type { Department } from "../../server/domain/department.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/appointment/{-$patient}")({ component: App });

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

  const params = Route.useParams();
  const paramPatient = params().patient;

  async function terminateModification(status: MessageStatus): Promise<void>{
    setModification(false);
    setVisible(true);
    setStatusMessage(status);
    if(patient().id){
      await getAppointments(patient(), false);
    }
  }

  function modifyData(){
    setSelected(s=>{s.patient=patient();return s});
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

  async function loadData(id: string){
    setModification(false);
    if(id != ""){
      const pat = await getPatient({data: {id}});
      if(pat){
        setId("");
        setPatient(pat);
        setMessage("");
        await getAppointments(pat, true);
      }else{
        setPatient(initPatient());
        setMessage("患者がみつかりませんでした");
        setVisible(false);
        setAppointments([]);
        if(refInput){
          refInput.select();
          refInput.focus();
        }
      }
    }
  }

  async function getAppointments(pat: Patient, noDataModify: boolean){
    const data = await getApp({data: {patientId: pat.id}});
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
    if(list.length === 0 && noDataModify){
      handleNew(pat);
    }
  }

  async function getData(id: string){
    const res = await getAppointment({data: {id}});
    if(res){
      setPatient(res.patient);
      setSelected(res);
      setModification(true);
      setNewadd(false);
    }
  }

  async function initialize(){
    getDepartments().then(setDepts);
    if(refInput){
      refInput.focus();
    }
    if(paramPatient && paramPatient.length < 20){
      await loadData(paramPatient);
    }else if(paramPatient){
      await getData(paramPatient);
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
          <ListArea appointments={appointments} modifyData={modifyData}
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