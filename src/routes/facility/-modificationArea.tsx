import { createSignal, onMount, Index, For, Show, type Setter, type Accessor } from "solid-js"
import { createStore, unwrap, type SetStoreFunction } from "solid-js/store"
import plus from "../assets/plus.svg"
import minus from "../assets/minus.svg"
import { initFacility, initContact, toUser } from "../../helper/types.ts"
import { AddressInput } from "../../components/AddressInput.tsx"
import { Container, ContainerImage } from "../../components/Container.tsx"
import { getKinds } from "../../server/func/master.ts"
import { insert, update, del } from "../../server/func/facility.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import type { Address } from "../../server/domain/address.ts"
import type { Facility, Contact } from "../../server/domain/facility.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area } from "../../styled-system/recipes/"

type ViewProps = {
  facility: Accessor<Facility>
  setFacility: Setter<Facility>
  terminateModification: (status: MessageStatus)=>void
  newadd: Accessor<boolean>
  auth: Accessor<AuthUser>
}

type ListProps = {
  contacts: Contact[],
  setFacility: SetStoreFunction<Facility>
}

function ContactList(props: ListProps){
  function handleChange(name: "tel"|"fax"|"email"|"name", index: number, value: string){
    const cs = props.contacts.slice();
    const c = {...cs[index]};
    c[name] = value;
    cs[index] = c;
    props.setFacility("contacts", cs);
  }

  function removeContact(index: number){
    if(props.contacts[index].email || props.contacts[index].tel ||
        props.contacts[index].fax || props.contacts[index].name){
      if(!confirm("入力中ですが削除してよろしいですか？")){
        return;
      }
    }
    const cs = props.contacts.filter((_, i)=>index !== i);
    props.setFacility("contacts", cs);
  }

  return (
    <For each={props.contacts}>{(contact, i)=>
    <div>
      <ContainerImage title={"宛先"+(i()+1)} src={minus} alt="+"
          onClick={()=>removeContact(i())}>
        <input type="text" placeholder="地域連携室" class={ input({ size: "full" }) }
          value={contact.name} onChange={(e)=>handleChange("name", i(), e.target.value)} />
      </ContainerImage>
      <Container title={"ＴＥＬ"+(i()+1)}>
        <input type="text" placeholder="03-1234-5678" class={ input({ size: "tel" }) }
          value={contact.tel} onChange={(e)=>handleChange("tel", i(), e.target.value)} />
      </Container>
      <Container title={"ＦＡＸ"+(i()+1)}>
        <input type="text" placeholder="03-1234-5678" class={ input({ size: "tel" }) }
          value={contact.fax} onChange={(e)=>handleChange("fax", i(), e.target.value)} />
      </Container>
      <Container title={"メール"+(i()+1)}>
        <input type="text" placeholder="mail@example.com" class={ input({ size: "full" }) }
          value={contact.email} onChange={(e)=>handleChange("email", i(), e.target.value)} />
      </Container>
    </div>
    }</For>
  );
}


export function ModificationArea(props: ViewProps){
  const [facility, setFacility] = createStore<Facility>(structuredClone(props.facility()));
  const [attrs, setAttrs] = createSignal<string[]>([]);

  async function handleRegister(){
    const f = {
      ...unwrap(facility),
      updatedBy: toUser(props.auth()),
    }
    if(props.newadd()){
      f.createdBy = toUser(props.auth());
    }

    let res;
    if(props.newadd()){
      res = await insert({data: { facility: f }});
    }else{
      res = await update({data: { facility: f }});
    }
    if(res.ok){
      props.setFacility(f);
      props.terminateModification("register");
    } else {
      setErrors(res.errors!);
    }
  }

  async function handleDelete(){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const res = await del({data: { facility: props.facility() }});
    if(res.ok){
      props.setFacility(initFacility());
      props.terminateModification("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  function addContact(){
    const c = facility.contacts.slice();
    c.push(initContact());
    setFacility("contacts", c);
  }

  function changeAddress(address: Address){
    setFacility("address", address);
  }

  onMount(()=>{
    getKinds().then((kinds)=>{
      setAttrs(kinds);
      if(attrs().length > 0 && facility.attribute){
        const attr = facility.attribute;
        setFacility("attribute", "");
        setFacility("attribute", attr);
      }
    });
  });

  return (
    <>
    <div class={ area({ type: "contents" }) }>
      <ErrorArea />
      <Container title="ＩＤ" require="*">
        <Show when={!props.newadd()}>
          <span>{props.facility().id}</span>
        </Show>
        <Show when={props.newadd()}>
          <input type="text" class={ input({ size: "id" }) } value={props.facility().id}
            onChange={(e)=>setFacility("id", e.target.value)} />
        </Show>
      </Container>
      <Container title="属性">
        <select class={ input({ size: "id" }) } value={facility.attribute}
          onChange={(e)=>setFacility("attribute", e.target.value)}>
          <option value=""></option>
          <Index each={attrs()}>{(attr)=>
            <option value={attr()}>{attr()}</option>
          }</Index>
        </select>
      </Container>
      <Container title="法人名">
        <input type="text" class={ input({ size: "full" }) } value={facility.nameCorp}
          onChange={(e)=>setFacility("nameCorp", e.target.value)} />
      </Container>
      <Container title="施設名" require="*">
        <input type="text" class={ input({ size: "full" }) } value={facility.name}
          onChange={(e)=>setFacility("name", e.target.value)} />
      </Container>
      <Container title="施設カナ">
        <input type="text" class={ input({ size: "full" }) } value={facility.kana}
          onChange={(e)=>setFacility("kana", e.target.value)} />
      </Container>
      <ContainerImage title="ＴＥＬ" src={plus} alt="+"
          onClick={addContact}>
        <input type="text" placeholder="03-1234-5678" class={ input({ size: "tel" }) }
          value={facility.tel} onChange={(e)=>setFacility("tel", e.target.value)} />
      </ContainerImage>
      <Container title="ＦＡＸ">
        <input type="text" placeholder="03-1234-5678" class={ input({ size: "tel" }) }
          value={facility.fax} onChange={(e)=>setFacility("fax", e.target.value)} />
      </Container>
      <Container title="メール">
        <input type="text" placeholder="mail@example.com" class={ input({ size: "full" }) }
          value={facility.email} onChange={(e)=>setFacility("email", e.target.value)} />
      </Container>
      <ContactList contacts={facility.contacts} setFacility={setFacility} />
      <Container title="住所">
        <AddressInput change={changeAddress} address={facility.address} />
      </Container>
      <Container title="備考">
        <textarea class={ input({ size: "textarea" }) } value={facility.memo}
          onChange={(e)=>setFacility("memo", e.target.value)} />
      </Container>
      <Container title="閉院日">
        <input type="date" class={ input({ size: "date" }) } value={facility.closedDate}
          onChange={(e)=>setFacility("closedDate", e.target.value)} />
      </Container>
      <Container title="送信用ＦＡＸ">
        <input type="text" placeholder="03-1234-5678" class={ input({ size: "tel" }) }
          value={facility.faxSendNo} onChange={(e)=>setFacility("faxSendNo", e.target.value)} />
      </Container>
      <Container title="受診報告不要">
        <input type="checkbox" class={ input({ size: "check2", type: "checkbox" }) }
          checked={facility.notSend}
          onChange={(e)=>setFacility("notSend", e.target.checked)} />
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