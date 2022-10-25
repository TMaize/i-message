import fs from 'fs'
import { resolve } from 'path'
import { defineConfig, UserConfigExport } from 'vite'
import dts from 'vite-plugin-dts'

const isProduction = process.env.NODE_ENV === 'production'

const config: UserConfigExport = {
  build: {
    sourcemap: false
  },
  plugins: [
    dts({
      afterBuild() {
        fs.rmSync('./dist/vite-env.d.ts')
        fs.renameSync('./dist/lib', './dist/dts')
      }
    })
  ]
}

if (isProduction) {
  config.build!.lib = {
    entry: resolve(__dirname, 'src/lib/main.ts'),
    name: 'IMessage',
    fileName: format => `i-message.${format}.js`
  }
} else {
  config.build!.rollupOptions = {
    input: {
      index: resolve(__dirname, 'index.html'),
      child: resolve(__dirname, 'child.html'),
    }
  }
}

export default defineConfig(config)
