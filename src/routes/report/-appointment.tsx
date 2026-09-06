import { createSignal, onMount, type Accessor } from "solid-js"
import { initAppointment } from "../../helper/types.ts"
import { AppointmentBase } from "./-appointmentBase.tsx"
import { getAppointment } from "../../server/func/appointment.ts"
import type { Appointment } from "../../server/domain/appointment.ts"

type Props = {
    id: Accessor<string>
    prepared?: ()=>void
}

export function AppointmentReport(props: Props) {
  const [appointment, setAppointment] = createSignal<Appointment>(initAppointment());

  onMount(async () => {
    const res = await getAppointment({data: {id: props.id()}});
    if(res){
      setAppointment(res);
      if(props.prepared) {
        props.prepared();
      }
    }else{
      setAppointment(initAppointment());
    }
  });

  return (
    <>
      <AppointmentBase appointment={appointment()} />
    </>
  )
}