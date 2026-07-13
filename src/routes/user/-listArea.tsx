import { For, createMemo, type Accessor } from "solid-js"
import type { AuthUser } from "../../server/domain/user.ts"
import type { Department } from "../../server/domain/department.ts"
import { table, list } from "../../styled-system/recipes/"

type ViewProps = {
    users: Accessor<AuthUser[]>
    select: (s: AuthUser) => void
    depts: Department[]
}

export function ListArea(props: ViewProps) {
  const names = ["", "閲覧", "編集"];
  const webNames = ["", "利用者", "管理者"];

  function handleClick(user: AuthUser){
    props.select(user);
  }

  function getName(id: number, names: string[]): string{
    return names[id]
  }

  const depts = createMemo(()=>{
    const map = new Map<string, string>();
    props.depts.forEach((dept:Department)=>
      map.set(dept.id, dept.name)
    );
    return map;
  });


  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <thead>
          <tr>
            <th>ID</th><th>氏名</th><th>部署</th><th>受付</th><th>紹介</th><th>施設</th><th>統計</th><th>マスター</th><th>Web予約</th><th>施設</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.users()}>{(user)=>
            <tr onClick={()=>handleClick(user)}>
              <td class={ list({ size: "rem3", font: "number" }) }>{user.id}</td>
              <td class={ list({ size: "rem10" }) }>{user.name}</td>
              <td class={ list({ size: "rem10" }) }>{depts().get(user.department)}</td>
              <td class={ list({ size: "rem3" }) }>{getName(user.authActivity, names)}</td>
              <td class={ list({ size: "rem3" }) }>{getName(user.authReferral, names)}</td>
              <td class={ list({ size: "rem3" }) }>{getName(user.authFacility, names)}</td>
              <td class={ list({ size: "rem3" }) }>{getName(user.authStatistics, names)}</td>
              <td class={ list({ size: "rem3" }) }>{getName(user.authMaster, names)}</td>
              <td class={ list({ size: "rem3" }) }>{getName(user.authWeb, webNames)}</td>
              <td class={ list( {size: "rem3", font: "number" }) }>{user.facilityId}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}