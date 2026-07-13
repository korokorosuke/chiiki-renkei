import { Show, children, type JSXElement } from "solid-js"
import { sva } from "../styled-system/css/"

type Props = {
  title: string
  require?: string
  children: JSXElement
}

export function Container(props: Props){
  const c = children(()=>props.children);
  const styles = style();
  return (
    <div class={ styles.root }>
      <div class={ styles.title }>{props.title}
        <Show when={props.require}>
          <span class={ styles.require }>{props.require}</span>
        </Show>
      </div>
      <div class={ styles.inputArea }>
        {c()}
      </div>
    </div>
  );
}

export function ContainerWeb(props: Props){
  const c = children(()=>props.children);
  const styles = style();
  return (
    <div class={ styles.root }>
      <div class={ styles.web }>{props.title}
        <Show when={props.require}>
          <span class={ styles.require }>{props.require}</span>
        </Show>
      </div>
      <div class={ styles.inputArea }>
        {c()}
      </div>
    </div>
  );
}

type PropsImage = {
  title: string
  require?: string
  children: JSXElement
  src: string
  alt: string
  onClick: (e?: MouseEvent)=>void
}

export function ContainerImage(props: PropsImage){
  const c = children(()=>props.children);
  const styles = style();
  return (
    <div class={ styles.root }>
      <div class={ styles.title }>{props.title}
        <img src={props.src} alt={props.alt} onClick={props.onClick} />
        <Show when={props.require}>
          <span class={ styles.require }>{props.require}</span>
        </Show>
      </div>
      <div class={ styles.inputArea }>
        {c()}
      </div>
    </div>
  );
}


type PropsButton = {
  title: string
  require?: string
  children: JSXElement
  buttonTitle: string
  onClick: ()=>void
  class: string
}

export function ContainerButton(props: PropsButton){
  const c = children(()=>props.children);
  const styles = style({ plus: "button" });
  return (
    <div class={ styles.root }>
      <div class={ styles.title }>
        <div class={ styles.label }>{props.title}
          <Show when={props.require}>
            <span class={ styles.require }>{props.require}</span>
          </Show>
        </div>
        <div><button type="button" class={ props.class }
          onClick={props.onClick}>{props.buttonTitle}</button></div>
      </div>
      <div class={ styles.inputArea }>
        {c()}
      </div>
    </div>
  );
}

function style(options?: object){
  return sva({
    slots: ["root", "title", "web", "inputArea", "label", "require"],
    base: {
      root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        border: "1px solid",
        borderColor: "container.border",
        borderTop: "none",
        boxSizing: "border-box",

        _first: {
          borderTop: "1px solid",
          borderTopColor: "container.border",
        },
      },

      web: {
        minWidth: "10rem",
        width: "10rem",
        backgroundColor: "web.title",
        padding: "0.7rem",
        position: "relative",

        "& + div": {
          flexGrow: "1",
        }
      },

      title: {
        minWidth: "10rem",
        width: "10rem",
        backgroundColor: "table.title",
        padding: "0.7rem",
        position: "relative",

        "& img": {
          width: "1.5rem",
          position: "absolute",
          top: "0.85rem",
          left: "8rem",
          cursor: "pointer",
        },

        "& + div": {
          flexGrow: "1",
        }
      },

      inputArea: {
        padding: "0.59rem 0.65rem",
      },

      label: {
        marginTop: "0.25rem",
      },

      require: {
        color: "red",
        fontSize: "1rem",
        paddingLeft: "0.27rem",
      },
    },
    variants: {
      plus: {
        nothing: {},
        button: {
          title: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "0.5rem 0.7rem",
          }
        },
      }
    },
    defaultVariants: {
      plus: "nothing"
    }
  })(options);
}