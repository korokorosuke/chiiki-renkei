import { createSignal, type Accessor } from "solid-js"
import { initAppointment } from "../../helper/types.ts"
import { DoneBase } from "./-doneBase.tsx"
import { Authenticator } from "../../components/Authenticator.tsx"
import { getAppointment } from "../../server/func/appointment.ts"
import type { Appointment } from "../../server/domain/appointment.ts"

type Props = {
    id: Accessor<string>
    prepared?: ()=>void
}

export function DoneReport(props: Props) {
  const [appointment, setAppointment] = createSignal<Appointment>(initAppointment());

  async function initialize(){
    const res = await getAppointment({data: {id: props.id()}});
    if(res){
      setAppointment(res);
      if(props.prepared) {
        props.prepared();
      }
    }else{
      setAppointment(initAppointment());
    }
  }

  return (
    <>
      <Authenticator initializer={initialize} />
      <DoneBase appointment={appointment()} />
    </>
  )
}