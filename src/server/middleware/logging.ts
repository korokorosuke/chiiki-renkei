import { createMiddleware } from '@tanstack/solid-start'
import { info } from '../func/log.ts'

export const LoggingMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const res = await next();
  // @ts-ignore: 型チェックがおかしい
  const { result, data, serverFnMeta: { name, filename } } = res;
  if(result.ok){
    const className = filename.split("/").pop()?.split(".")[0];
    const className2 = className.charAt(0).toUpperCase() + className.slice(1);
    let pid: string|undefined;
    if(className === "patient"){
      pid = data[className].id;
    }else{
      pid = data[className]?.patient?.id;
    }
    info({ data: { title: `${name} ${className2}`, details: JSON.stringify(data),
      patientId: pid } });
  }
  return res;
})