import { For, Show, type Accessor, type Setter } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { Container } from "../../components/Container.tsx"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { insert, update, del } from "../../server/func/user.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import type { Department } from "../../server/domain/department.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type ViewProps = {
  user: Accessor<AuthUser>
  setUser: Setter<AuthUser>
  depts: Department[]
  terminateModification: (status: MessageStatus)=>void
  newadd: boolean
}

export function ModificationArea(props: ViewProps){
  const [user, setUser] = createStore<AuthUser>(structuredClone(props.user()));

  async function handleRegister(){
    const u = unwrap(user);
    let res;
    if(props.newadd){
      res = await insert({data: {user: u}});
    }else{
      res = await update({data: {user: u}});
    }
    if(res.ok){
      props.setUser(u);
      props.terminateModification("register");
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleDelete(){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const res = await del({data: {user: props.user()}});
    if(res.ok){
      props.terminateModification("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  function handleLock(locked: boolean){
    setUser("locked", locked);
    setUser("failCount", 0);
  }


  return (
    <>
    <div class={ area({ type: "contents" }) }>
      <ErrorArea />
      <Container title="ＩＤ" require="*">
        <Show when={!props.newadd}>
          <span class={ css({ display: "inline-block" }) }>{user.id}</span>
        </Show>
        <Show when={props.newadd}>
          <input type="text" class={ input({ size: "id" }) }
            value={user.id} onChange={(e)=>setUser("id", e.target.value)} />
        </Show>
      </Container>
      <Container title="氏名" require="*">
        <input type="text" class={ input({ size: "text" }) }
          value={user.name} onChange={(e)=>setUser("name", e.target.value)} />
      </Container>
      <Container title="部署" require="*">
        <select class={ input({ size: "dept" }) } value={user.department}
            onChange={(e)=>setUser("department", e.target.value)} >
          <For each={props.depts}>{(dept)=>
            <option value={dept.id}>{dept.name}</option>
          }</For>
        </select>
      </Container>
      <Container title="受付">
        <select class={ input({ size: "id" }) } value={user.authActivity.toString()}
            onChange={(e)=>setUser("authActivity", parseInt(e.target.value))}>
          <option value="0"></option>
          <option value="1">閲覧</option>
          <option value="2">編集</option>
        </select>
      </Container>
      <Container title="紹介">
        <select class={ input({ size: "id" }) } value={user.authReferral}
            onChange={(e)=>setUser("authReferral", parseInt(e.target.value))}>
          <option value="0"></option>
          <option value="1">閲覧</option>
          <option value="2">編集</option>
        </select>
      </Container>
      <Container title="施設">
        <select class={ input({ size: "id" }) } value={user.authFacility}
            onChange={(e)=>setUser("authFacility", parseInt(e.target.value))}>
          <option value="0"></option>
          <option value="1">閲覧</option>
          <option value="2">編集</option>
        </select>
      </Container>
      <Container title="統計">
        <select class={ input({ size: "id" }) } value={user.authStatistics}
            onChange={(e)=>setUser("authStatistics", parseInt(e.target.value))}>
          <option value="0"></option>
          <option value="1">閲覧</option>
          <option value="2">編集</option>
        </select>
      </Container>
      <Container title="マスター">
        <select class={ input({ size: "id" }) } value={user.authMaster}
          onChange={(e)=>setUser("authMaster", parseInt(e.target.value))}>
          <option value="0"></option>
          <option value="1">閲覧</option>
          <option value="2">編集</option>
        </select>
      </Container>
      <Container title="パスワード" require="*">
        <input type="password" class={ input({ size: "text" }) }
          value={user.password} onChange={(e)=>setUser("password", e.target.value)} />
      </Container>
      <Container title="Web予約">
        <select class={ input({ size: "id" }) } value={user.authWeb}
            onChange={(e)=>setUser("authWeb", parseInt(e.target.value))}>
          <option value="0"></option>
          <option value="1">利用者</option>
          <option value="2">管理者</option>
        </select>
      </Container>
      <Container title="施設ID">
        <input type="text" class={ input({ size: "id" }) }
          value={user.facilityId} onChange={(e)=>setUser("facilityId", e.target.value)} />
        <span class={ css({
            color: "red", marginLeft: "0.5rem", marginTop: "1rem", fontSize: "1rem" }) }>
          ※Web予約用ユーザーは必須
        </span>
      </Container>
      <Container title="ロック">
        <input type="checkbox" class={ input({ size: "check2", type: "checkbox" }) }
          checked={user.locked} onChange={(e)=>handleLock(e.target.checked)} />
      </Container>
      <div class={ area({ type: "button" }) }>
        <button type="button" class={ button({ color: "primary", size: "long" }) } onClick={handleRegister}>登録</button>
        <button type="button" class={ button({ color: "cancel", size: "long" }) } onClick={()=>props.terminateModification("cancel")}>キャンセル</button>
        <Show when={!props.newadd}>
          <button type="button" class={ button({ color: "error", size: "long" }) } onClick={handleDelete}>削除</button>
        </Show>
      </div>
    </div>
    </>
  );
}