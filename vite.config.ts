import fs from 'fs'
import { resolve } from 'path'
import { defineConfig, UserConfigExport } from 'vite'
import dts from 'vite-plugin-dts'


export default defineConfig(({ mode }) => {
  const config: UserConfigExport = {
    base: './',
    build: {
      sourcemap: false
    }
  }

  if (mode !== 'lib') {
    config.build!.rollupOptions = {
      input: {
        index: resolve(__dirname, 'index.html'),
        child: resolve(__dirname, 'child.html'),
      }
    }
  }

  if (mode === 'lib') {
    config.plugins = [
      dts({
        afterBuild() {
          fs.rmSync('./dist/vite-env.d.ts')
          fs.renameSync('./dist/lib', './dist/dts')
        }
      })
    ]
    config.build!.lib = {
      entry: resolve(__dirname, 'src/lib/main.ts'),
      name: 'IMessage',
      fileName: format => `i-message.${format}.js`
    }
  }

  return config
})
