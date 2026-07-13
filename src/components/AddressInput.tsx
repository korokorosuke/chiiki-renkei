import { createSignal, createEffect } from "solid-js"
import { getAddress } from "../server/func/address.ts"
import type { Address } from "../server/domain/address.ts"
import { css } from "../styled-system/css/"
import { input, button } from "../styled-system/recipes/"

type Props = {
  address: Address
  change: (address: Address) => void
}

export function AddressInput(props: Props){
  const [postalCode, setPostalCode] = createSignal("");
  const [address1, setAddress1] = createSignal("");
  const [address2, setAddress2] = createSignal("");
  const [message, setMessage] = createSignal("");

  async function fetchAddress(postalCode: string){
    if(!/^[0-9]{3}-?[0-9]{4}$/.test(postalCode)){
      setMessage("郵便番号の形式が正しくありません。");
      return;
    }
    setMessage("");
    const res = await getAddress({data: {postalCode}});
    if(res){
      setAddress1(res.name);
    }
    props.change({postalCode: postalCode, name: address1(), plus: address2()});
  }

  async function handleEnter(e: KeyboardEvent){
    if(e.key === "Enter"){
      await fetchAddress(postalCode());
    }
  }

  function handleChange(address: Partial<Address>){
    if("postalCode" in address){
      setPostalCode(address.postalCode ?? "");
    }
    if("name" in address){
      setAddress1(address.name ?? "");
    }
    if("plus" in address){
      setAddress2(address.plus ?? "");
    }
    props.change({postalCode: postalCode(), name: address1(), plus: address2()});
  }

  createEffect(()=>{
    setPostalCode(props.address.postalCode);
    setAddress1(props.address.name);
    setAddress2(props.address.plus);
  })


  return (
    <div>
      <div class={ styles }>
        <div>郵便番号</div>
        <div>
          <input type="text" class={ input({ size: "post", type: "number" }) }
            value={postalCode()} placeholder="100-0001"
            onChange={(e)=>handleChange({postalCode: e.target.value})}
            onKeyUp={(e)=>handleEnter(e)} />
        </div>
        <div>
          <button type="button" class={ button({ color: "normal", size: "small" }) }
            onClick={()=>fetchAddress(postalCode())}>住所検索</button>
        </div>
        <div class={ css({ color: "red", marginLeft: "0.5rem" })}>{message()}</div>
      </div>
      <div class={ styles }>
        <div>住所</div>
        <div>
          <input type="text" class={ input({ size: "address" }) }
            value={address1()} placeholder="東京都千代田区千代田"
            onChange={(e)=>handleChange({name: e.target.value})} />
        </div>
      </div>
      <div class={ styles }>
        <div>番地等</div>
        <div>
          <input type="text" class={ input({ size: "address" })}
            value={address2()} placeholder="1-1-1"
            onChange={(e)=>handleChange({plus: e.target.value})} />
        </div>
      </div>
    </div>
  );
}

const styles = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  "& div:first-child": {
    width: "5.3rem",
    textAlign: "right",
  },
  "& div:nth-child(2)": {
    padding: "0",
    marginLeft: "0.6rem",
    marginBottom: "0.5rem",
  },
  "& button": {
    marginLeft: "0.5rem",
  }
});