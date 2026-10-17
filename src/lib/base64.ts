export function encode(data: Uint8Array|ArrayBuffer|string): string {
  if(data instanceof ArrayBuffer){
    data = new Uint8Array(data);
  }else if(data instanceof String){
    data = new TextEncoder().encode(data as string);
  }
  return Buffer.from(data).toString("base64")
}

export function decode(data: string): Uint8Array<ArrayBuffer> {
   //return Buffer.from(data, "base64").toString("utf-8");
   return new Uint8Array(Buffer.from(data, "base64"));
}