import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist/types'
    })
  ],
  define: {
    // Define process.env for UMD build (browser compatibility)
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': JSON.stringify({})
  },
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
        exports: 'named', // Named exports only
        globals: {
          localforage: 'localforage'
        }
      }
    }
  }
})
