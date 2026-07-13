import { createSignal, createEffect, type Accessor } from "solid-js"
import { initUser } from "../../helper/types.ts"
import { getUser } from "../../server/func/user.ts"
import { Container } from "../../components/Container.tsx"
import type { Response } from "../../server/domain/inquiry.ts"
import type { User } from "../../server/domain/user.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { flex, grid } from "../../styled-system/patterns/"
import { css } from "../../styled-system/css/"

type ListProps = {
  selectedRes: Accessor<Response>
  selectedResIndex: Accessor<number>
  done: boolean
  changeResponse: (response: Response, index: number, done: boolean) => void
  evacuateResponse: (response: Response, index: number, done: boolean) => void
  clearResponse: ()=>void
  focus: boolean
}

function handleKeyUp(e: KeyboardEvent,
    func: (id: string)=>void, id: string){
  if(e.key === "Enter"){
    func(id);
  }
}

export function ResponseModify(props: ListProps){
  const [responder, setResponder] = createSignal<User>(initUser());
  const [datetime, setDatetime] = createSignal("");
  const [details, setDetails] = createSignal("");
  const [done, setDone] = createSignal(false);

  let refInput: HTMLTextAreaElement | undefined;

  function clear(){
    props.clearResponse();
  }

  async function getResponder(id: string){
    const val = await getUser({data: {id}});
    if(val){
      const responder = val;
      setResponder(responder);
      const res = getResponse();
      res.responder = responder;
      setResponse(res);
    }
  }

  function getResponse(): Response{
    return {
      responder: responder(),
      datetime: datetime(),
      details: details()
    }
  }

  function setResponse(res: Response) {
    if(!details){
      return;
    }
    if(props.selectedResIndex() >= 0){
      props.changeResponse(res, props.selectedResIndex(), done());
    }else{
      props.evacuateResponse(res, props.selectedResIndex(), done());
    }
  }

  function initialize(res: Response){
    setResponder(res.responder);
    setDatetime(res.datetime);
    setDetails(res.details);
    setDone(props.done);
  }

  createEffect(()=>{
    initialize(props.selectedRes());
    if(props.focus && refInput){
      refInput.focus();
    }
  }, [props.selectedRes]);

  return (
    <div class={ area({ type: "contents" }) }>
      <Container title="対応日時" require="*">
        <div class={ flex({ direction: "row", wrap: "wrap" }) }>
        <div><input type="datetime-local" class={ input({ size: "datetime" }) }
          value={datetime()} onBlur={()=>setResponse(getResponse())}
          onChange={(e)=>setDatetime(e.target.value)} /></div>
        <div><button type="button" class={ button({ color: "primary", size: "slim", space: "left1" }) }
          onClick={clear}>クリア</button></div>
        </div>
      </Container>
      <Container title="対応者" require="*">
        <div class={ flex({ direction: "row", wrap: "wrap" }) }>
        <div class={ css({ flexGrow: "0!", marginRight: "1rem" }) }>
          <input type="text" class={ input({ size: "id" }) }
            value={responder().id} onBlur={()=>getResponder(responder().id)}
            onKeyUp={(e)=>handleKeyUp(e, getResponder, responder().id)}
            onChange={(e)=>setResponder({...initUser(), id: e.target.value})} /></div>
          <div class={ grid({ placeItems: "center" }) }>{responder().name}</div>
        </div>
      </Container>
      <Container title="対応内容" require="*">
        <textarea class={ input({ size: "textarea" }) } ref={refInput}
          value={details()} onBlur={()=>setResponse(getResponse())}
          onChange={(e)=>setDetails(e.target.value)}></textarea>
      </Container>
      <Container title="対応完了">
        <div><input type="checkbox" class={ input({ size: "check2", type: "checkbox" }) }
          checked={done()} onBlur={()=>setResponse(getResponse())}
          onChange={()=>setDone(!done())} /></div>
      </Container>
    </div>
  );
}