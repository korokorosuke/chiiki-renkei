import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  redirect
} from '@tanstack/solid-router'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'

import { HydrationScript } from 'solid-js/web'
import { Suspense } from 'solid-js'
import { get } from '../server/func/auth.ts'
import { getSessionBase } from '../server/func/base.ts'
import { initialize } from '../server/domain/user.ts'
import { initialize as initBase } from '../server/domain/base.ts'
import { info, writeLogWithBase } from "../server/func/log.ts"
import { getBaseFromPath } from "../server/domain/log.ts"

// @ts-ignore: URLをimportするときの型定義がないため
import styleCss from '../styles.css?url'

function writeLog(path: string) {
  info({ data: { title: "page load", details: path } }).then(()=>{});
}

function writeLog2(path: string) {
  const base = getBaseFromPath(path);
  writeLogWithBase({ data: { base, level: "info", title: "page load", details: path } }).then(()=>{});
}

export const Route = createRootRouteWithContext()({
  beforeLoad: async ({ location }) => {
    if(location.pathname.startsWith('/login') ||
        (location.pathname.startsWith('/answer/') && !location.pathname.startsWith('/answer/patient'))){
      writeLog2(location.pathname);
      return { ok: true, user: initialize(), base: initBase() };
    }

    writeLog(location.pathname);

    const res = await get();
    if(res.ok){
      const base = await getSessionBase();
      if(base){
        return { ok: true, user: res.data, base };
      }
    }
    throw redirect({
      // @ts-ignore: なんかエラーになるため
      to: '/login',
    });
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: '地域連携システム',
      },
    ],
    links: [{ rel: 'stylesheet', href: styleCss }],
  }),
  pendingComponent: () => <p>Now loading…</p>,
  shellComponent: RootComponent,
})

function RootComponent() {
  return (
    <html>
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body>
        <Suspense>
          <Outlet />
          <TanStackRouterDevtools />
        </Suspense>
        <Scripts />
      </body>
    </html>
  )
}