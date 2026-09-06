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
import { initialize } from '../server/domain/user.ts'

// @ts-ignore: URLをimportするときの型定義がないため
import styleCss from '../styles.css?url'

export const Route = createRootRouteWithContext()({
  beforeLoad: async ({ location }) => {
    if(location.pathname.startsWith('/login') ||
        (location.pathname.startsWith('/answer/') && !location.pathname.startsWith('/answer/patient'))){
      return { ok: true, user: initialize() };
    }
    const res = await get();
    if(res.ok){
      return { ok: true, user: res.data };
    } else {
      return { ok: false, user: initialize() };
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