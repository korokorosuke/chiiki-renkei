import { Show, type Accessor, type Setter } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { Container } from "../../components/Container.tsx"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { insert, update, del } from "../../server/func/address.ts"
import type { Address } from "../../server/domain/address.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area } from "../../styled-system/recipes/"

type ViewProps = {
  address: Accessor<Address>
  setAddress: Setter<Address>
  terminateModification: (status: MessageStatus)=>void
  newadd: Accessor<boolean>
}

export function ModificationArea(props: ViewProps){
  const [address, setAddress] = createStore<Address>(structuredClone(props.address()));

  async function handleRegister(){
    const u = unwrap(address);
    let res;
    if(props.newadd()){
      res = await insert({data: { address: u }});
    }else{
      res = await update({data: { address: u }});
    }
    if(res.ok){
      props.setAddress(u);
      props.terminateModification("register");
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleDelete(){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }
    const res = await del({ data: { address: props.address() } });
    if(res.ok){
      props.terminateModification("delete");
    }else{
      setErrors(res.errors!);
    }
  }


  return (
    <>
    <div class={ area({ type: "contents" }) }>
      <ErrorArea />
      <Container title="郵便番号" require="*">
        <Show when={!props.newadd()}>
        <span>{address.postalCode}</span>
        </Show>
        <Show when={props.newadd()}>
        <input type="text" class={ input({ size: "id" }) }
          value={address.postalCode} onChange={(e)=>setAddress("postalCode", e.target.value)} />
        </Show>
      </Container>
      <Container title="住所" require="*">
        <input type="text" class={ input({ size: "full" }) }
          value={address.name} onChange={(e)=>setAddress("name", e.target.value)} />
      </Container>
      <div class={ area({ type: "button" }) }>
        <button type="button" class={ button({ color: "primary", size: "long" }) } onClick={handleRegister}>登録</button>
        <button type="button" class={ button({ color: "cancel", size: "long" }) } onClick={()=>props.terminateModification("cancel")}>キャンセル</button>
        <Show when={!props.newadd()}>
          <button type="button" class={ button({ color: "error", size: "long" }) } onClick={handleDelete}>削除</button>
        </Show>
      </div>
    </div>
    </>
  );
}