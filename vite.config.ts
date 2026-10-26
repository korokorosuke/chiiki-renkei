import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import pandacss from '@pandacss/vite'

import solidPlugin from 'vite-plugin-solid'
import { nitro } from 'nitro/vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro(),
    tanstackStart(),
    solidPlugin({ ssr: true }),
    pandacss()
  ],
})
