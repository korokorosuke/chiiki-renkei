import { createMiddleware } from '@tanstack/solid-start'
import { info } from '../func/log.ts'

export const LoggingMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const res = await next();
  // @ts-ignore: 型チェックできない
  const { result, data, serverFnMeta: { name } } = res;
  if(result.ok){
    const className = Object.keys(data)[0];
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
});

export const LoggingPatientMiddleware = createMiddleware({ type: 'function' })
    // @ts-ignore: 型チェックできない
    .server(async ({ next, request: { headers, url } } ) => {
  const res = await next();
  // @ts-ignore: 型チェックできない
  const { result, serverFnMeta: { name } } = res;
  if(result){
    const host = headers.get("host");
    const regex = new RegExp(`http[s]?://${host}`);
    let path = url.replace(regex, "");
    if(path.startsWith("/_serverFn")){
      path = headers.get("referer").replace(regex, "");
    }
    info({ data: { title: name, details: path, patientId: result.id } });
  }
  return res;
});