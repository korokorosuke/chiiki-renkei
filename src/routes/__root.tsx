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

// @ts-ignore: URLをimportするときの型定義がないため
import styleCss from '../styles.css?url'

export const Route = createRootRouteWithContext()({
  beforeLoad: async ({ location }) => {
    if(location.pathname.startsWith('/login') ||
        (location.pathname.startsWith('/answer/') && !location.pathname.startsWith('/answer/patient'))){
      return { ok: true, user: initialize(), base: initBase() };
    }
    const res = await get();
    if(res.ok){
      const base = await getSessionBase() ?? initBase();
      return { ok: true, user: res.data, base };
    } else {
      return { ok: false, user: initialize(), base: initBase() };
    }
  },
  loader: ({ context }) => {
    if(!context.ok){
      throw redirect({
        // @ts-ignore: なんかエラーになるため
        to: '/login',
      });
    }
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