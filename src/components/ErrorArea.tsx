import { createSignal, createEffect, Show, Index } from "solid-js"
import { css } from "../styled-system/css/"

type Props = {
  errors?: string[]
}

const [errors, setErrors] = createSignal<string[]>([]);
export { setErrors };

export function ErrorArea(props: Props){
  createEffect(()=>{
    if(props.errors){
      setErrors(props.errors);
    }else{
      setErrors([]);
    }
  });

  return (
    <Show when={errors().length > 0}>
      <div class={ styles }>
        <ul>
        <Index each={errors()}>{e=>
          <li>{e()}</li>
        }</Index>
        </ul>
      </div>
    </Show>
  );
}

const styles = css({
  width: "100%",
  padding: "0.7rem 1rem",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "red.500",
  color: "red.600",
  bgColor: "red.100",
  textAlign: "left",
  fontSize: "1.1rem",
});