import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist/types'
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Ombor',
      formats: ['es', 'umd'],
      fileName: (format) => `ombor.${format}.js`
    },
    rollupOptions: {
      external: ['localforage'],
      output: {
        exports: 'named',
        globals: {
          localforage: 'localforage'
        }
      }
    }
  }
})
