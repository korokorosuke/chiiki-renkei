import { createSignal, onMount, For, Index, Show, type Setter, type Accessor } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { initStaff, toUser } from "../../helper/types.ts"
import { getFacDepts, getPosts } from "../../server/func/master.ts"
import { insert, update, del } from "../../server/func/staff.ts"
import { Container } from "../../components/Container.tsx"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import type { AuthUser } from "../../server/domain/user.ts"
import type { Staff } from "../../server/domain/staff.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area } from "../../styled-system/recipes/"

type ViewProps = {
  staff: Accessor<Staff>
  setStaff: Setter<Staff>
  terminateModification: (status: MessageStatus)=>void
  newadd: boolean
  auth: Accessor<AuthUser>
}

export function ModificationArea(props: ViewProps){
  const [staff, setStaff] = createStore<Staff>(props.staff());
  const [posts, setPosts] = createSignal<string[]>([]);
  const [facDepts, setFacDepts] = createSignal<string[]>([]);

  async function handleRegister(){
    const s = {
      ...unwrap(staff),
      updatedBy: toUser(props.auth()),
    };
    let res;
    if(props.newadd){
      res = await insert({data: {staff: s}});
    }else{
      res = await update({data: {staff: s}});
    }
    if(res.ok){
      props.setStaff(s);
      props.terminateModification("register");
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleDelete(){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const res = await del({data: {staff: props.staff()}});
    if(res.ok){
      props.setStaff(initStaff());
      props.terminateModification("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  onMount(()=>{
    getFacDepts().then(setFacDepts);
    getPosts().then((data)=>{
      setPosts(data);
      if(posts().length > 0 && staff.post){
        const post = staff.post;
        setStaff("post", "");
        setStaff("post", post);
      }
    });
  });


  return (
    <>
    <div class={ area({ type: "contents" }) }>
      <ErrorArea />
      <Container title="職員名" require="*">
        <input type="text" class={ input({ size: "text" }) }
          value={staff.name} onChange={(e)=>setStaff("name", e.target.value)} />
      </Container>
      <Container title="職員カナ">
        <input type="text" class={ input({ size: "text" }) }
          value={staff.kana} onChange={(e)=>setStaff("kana", e.target.value)} />
      </Container>
      <Container title="部署" require="*">
        <input type="text" class={ input({ size: "text" }) } list="facdept"
          value={staff.department} onChange={(e)=>setStaff("department", e.target.value)} />
        <datalist id="facdept">
          <For each={facDepts()}>{(fdept)=>
            <option value={fdept}>{fdept}</option>
          }</For>
        </datalist>
      </Container>
      <Container title="医師">
        <input type="checkbox" class={ input({ size: "check2", type: "checkbox" }) }
          checked={staff.dr}
          onChange={()=>setStaff("dr", !staff.dr)} />
      </Container>
      <Container title="役職">
        <select class={ input({ size: "id" }) } value={staff.post}
            onChange={(e)=>setStaff("post", e.target.value)}>
          <option value=""></option>
          <Index each={posts()}>{(post)=>
            <option value={post()}>{post()}</option>
          }</Index>
        </select>
      </Container>
      <Container title="並び順" require="*">
        <input type="number" placeholder="整数" class={ input({ size: "id" }) }
          value={staff.sort} onChange={(e)=>setStaff("sort", parseInt(e.target.value))} />
      </Container>
      <Container title="非表示">
        <input type="checkbox" class={ input({ size: "check2", type: "checkbox" }) }
          checked={staff.hidden}
          onChange={()=>setStaff("hidden", !staff.hidden)} />
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