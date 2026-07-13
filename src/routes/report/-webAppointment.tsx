import { createResource } from "solid-js"
import { initAppointment } from "../../helper/types.ts"
import { AppointmentBase } from "./-appointmentBase.tsx"
import { Authenticator } from "../../components/Authenticator.tsx"
import { toAppointment } from "../../helper/webtypes.ts"
import { getFac } from "../../server/func/facility.ts"
import { getWebAppointment } from "../../server/func/webappointment.ts"
import type { Appointment } from "../../server/domain/appointment.ts"

type Props = {
  id: string
  prepared?: ()=>void
}

export function WebAppointmentReport(props: Props) {
  const [appointment] = createResource<Appointment, string>(()=> props.id, loadData);

  async function loadData(id: string): Promise<Appointment>{
    if(id){
      const res = await getWebAppointment({data: {id}});
      if(res){
        const fac = await getFac({data: {id: res.facility.id}});
        if(fac){
          res.facility = fac;
          const app = toAppointment(res);
          if(props.prepared) {
            props.prepared();
          }
          return app;
        }
      }
    }
    return initAppointment();
  }

  return (
    <>
    <Authenticator />
    <AppointmentBase appointment={appointment()} />
    </>
  );
}