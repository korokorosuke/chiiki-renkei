import { For, Show } from "solid-js"
import { unwrap, type SetStoreFunction } from "solid-js/store"
import { initWebDr } from "../../helper/webtypes.ts"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import type { WebDepartment } from "../../server/domain/webDepartment.ts"
import { css } from "../../styled-system/css/"

type Props = {
  depts: WebDepartment[]
  next: () => void
  selected: WebAppointment
  setSelected: SetStoreFunction<WebAppointment>
}

export function DeptSelect(props: Props){
  function handleClick(id: string){
    const d = props.depts.filter(dept=>dept.id === id);
    if(d.length === 1){
      props.setSelected("department", d[0]);
      props.setSelected("date", "");
      props.setSelected("time", "");
      props.setSelected("dr", initWebDr());
      props.next();
    }
  }

  return (
    <>
      <For each={props.depts}>{dept=>
        <div class={ css({ width: "100%", marginTop: "1rem" }) }>
          <label class={ inputStyle }>
            <input type="radio" value={dept.id} name="dept"
              checked={unwrap(props.selected.department.id) === dept.id}
              onChange={(e)=>handleClick(e.target.value)} />
            {dept.name}
            <Show when={dept.description}>
              <span>({dept.description})</span>
            </Show>
          </label>
        </div>
      }</For>
    </>
  );
}

const inputStyle = css({
  padding: "0.2rem 0.5rem 0.3rem 0.5rem",
  border: "2px solid",
  borderRadius: "4px",
  borderColor: "#8ac8b0",
  color: "#00785a",
  display: "inline-block",
  width: "100%",
  cursor: "pointer",
  //"& > input": { display: "none" },
  "&:has(input:checked)": {
    backgroundColor: "web.title",
    color: "#00785a",
    borderColor: "#71cead",
  },
});