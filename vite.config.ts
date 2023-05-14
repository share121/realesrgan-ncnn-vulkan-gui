import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {
  VueUseComponentsResolver,
  VueUseDirectiveResolver
} from 'unplugin-vue-components/resolvers'

// 兼容性处理
import browserslist from 'browserslist'
import legacy from '@vitejs/plugin-legacy'

// 文件分割
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'

// 打包占用分析
import { visualizer } from 'rollup-plugin-visualizer'

// 图标自动导入
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// 中间代码查看
import Inspect from 'vite-plugin-inspect'

// 加载 .browserslistrc 文件
const browserslistConfig = browserslist.loadConfig({ path: '.' })

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core', '@vueuse/head', '@vueuse/math', 'pinia', 'vue-router'],
      dts: true,
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      resolvers: [
        IconsResolver({
          prefix: false,
          enabledCollections: ['solar']
        }),
        VueUseComponentsResolver(),
        VueUseDirectiveResolver()
      ],
      dts: true
    }),
    Icons({
      autoInstall: true
    }),
    legacy({
      ignoreBrowserslistConfig: true,
      modernPolyfills: true,
      targets: browserslistConfig
    }),
    chunkSplitPlugin({
      // 文件分割方式
      strategy: 'unbundle'
    }),
    visualizer(),
    Inspect({
      build: true,
      outputDir: '.vite-inspect'
    })
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    host: '0.0.0.0',
    port: 1420,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'terser' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}))
