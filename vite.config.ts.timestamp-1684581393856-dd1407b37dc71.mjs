// vite.config.ts
import { defineConfig } from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import AutoImport from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/unplugin-vue-components/dist/vite.mjs";
import {
  VueUseComponentsResolver,
  VueUseDirectiveResolver
} from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import browserslist from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/browserslist/index.js";
import legacy from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import { chunkSplitPlugin } from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/vite-plugin-chunk-split/dist/index.js";
import { visualizer } from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import Icons from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/unplugin-icons/dist/resolver.mjs";
import Inspect from "file:///D:/code/realesrgan-ncnn-vulkan-gui/node_modules/vite-plugin-inspect/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\code\\realesrgan-ncnn-vulkan-gui";
var browserslistConfig = browserslist.loadConfig({ path: "." });
var vite_config_default = defineConfig(async () => ({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "@vueuse/core", "@vueuse/head", "@vueuse/math", "pinia", "vue-router"],
      dts: true,
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      resolvers: [
        IconsResolver({
          prefix: false,
          enabledCollections: ["solar"]
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
      strategy: "unbundle"
    }),
    visualizer(),
    Inspect({
      build: true,
      outputDir: ".vite-inspect"
    })
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    host: "0.0.0.0",
    port: 1420,
    strictPort: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "terser" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]"
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2RlXFxcXHJlYWxlc3JnYW4tbmNubi12dWxrYW4tZ3VpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjb2RlXFxcXHJlYWxlc3JnYW4tbmNubi12dWxrYW4tZ3VpXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9jb2RlL3JlYWxlc3JnYW4tbmNubi12dWxrYW4tZ3VpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcblxyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5cclxuLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7XHJcbiAgVnVlVXNlQ29tcG9uZW50c1Jlc29sdmVyLFxyXG4gIFZ1ZVVzZURpcmVjdGl2ZVJlc29sdmVyXHJcbn0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5cclxuLy8gXHU1MTdDXHU1QkI5XHU2MDI3XHU1OTA0XHU3NDA2XHJcbmltcG9ydCBicm93c2Vyc2xpc3QgZnJvbSAnYnJvd3NlcnNsaXN0J1xyXG5pbXBvcnQgbGVnYWN5IGZyb20gJ0B2aXRlanMvcGx1Z2luLWxlZ2FjeSdcclxuXHJcbi8vIFx1NjU4N1x1NEVGNlx1NTIwNlx1NTI3MlxyXG5pbXBvcnQgeyBjaHVua1NwbGl0UGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tY2h1bmstc3BsaXQnXHJcblxyXG4vLyBcdTYyNTNcdTUzMDVcdTUzNjBcdTc1MjhcdTUyMDZcdTY3OTBcclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcclxuXHJcbi8vIFx1NTZGRVx1NjgwN1x1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVxyXG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSdcclxuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSAndW5wbHVnaW4taWNvbnMvcmVzb2x2ZXInXHJcblxyXG4vLyBcdTRFMkRcdTk1RjRcdTRFRTNcdTc4MDFcdTY3RTVcdTc3MEJcclxuaW1wb3J0IEluc3BlY3QgZnJvbSAndml0ZS1wbHVnaW4taW5zcGVjdCdcclxuXHJcbi8vIFx1NTJBMFx1OEY3RCAuYnJvd3NlcnNsaXN0cmMgXHU2NTg3XHU0RUY2XHJcbmNvbnN0IGJyb3dzZXJzbGlzdENvbmZpZyA9IGJyb3dzZXJzbGlzdC5sb2FkQ29uZmlnKHsgcGF0aDogJy4nIH0pXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYXN5bmMgKCkgPT4gKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICBpbXBvcnRzOiBbJ3Z1ZScsICdAdnVldXNlL2NvcmUnLCAnQHZ1ZXVzZS9oZWFkJywgJ0B2dWV1c2UvbWF0aCcsICdwaW5pYScsICd2dWUtcm91dGVyJ10sXHJcbiAgICAgIGR0czogdHJ1ZSxcclxuICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgcHJlZml4OiBmYWxzZSxcclxuICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogWydzb2xhciddXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgVnVlVXNlQ29tcG9uZW50c1Jlc29sdmVyKCksXHJcbiAgICAgICAgVnVlVXNlRGlyZWN0aXZlUmVzb2x2ZXIoKVxyXG4gICAgICBdLFxyXG4gICAgICBkdHM6IHRydWVcclxuICAgIH0pLFxyXG4gICAgSWNvbnMoe1xyXG4gICAgICBhdXRvSW5zdGFsbDogdHJ1ZVxyXG4gICAgfSksXHJcbiAgICBsZWdhY3koe1xyXG4gICAgICBpZ25vcmVCcm93c2Vyc2xpc3RDb25maWc6IHRydWUsXHJcbiAgICAgIG1vZGVyblBvbHlmaWxsczogdHJ1ZSxcclxuICAgICAgdGFyZ2V0czogYnJvd3NlcnNsaXN0Q29uZmlnXHJcbiAgICB9KSxcclxuICAgIGNodW5rU3BsaXRQbHVnaW4oe1xyXG4gICAgICAvLyBcdTY1ODdcdTRFRjZcdTUyMDZcdTUyNzJcdTY1QjlcdTVGMEZcclxuICAgICAgc3RyYXRlZ3k6ICd1bmJ1bmRsZSdcclxuICAgIH0pLFxyXG4gICAgdmlzdWFsaXplcigpLFxyXG4gICAgSW5zcGVjdCh7XHJcbiAgICAgIGJ1aWxkOiB0cnVlLFxyXG4gICAgICBvdXRwdXREaXI6ICcudml0ZS1pbnNwZWN0J1xyXG4gICAgfSlcclxuICBdLFxyXG4gIC8vIFZpdGUgb3B0aW9ucyB0YWlsb3JlZCBmb3IgVGF1cmkgZGV2ZWxvcG1lbnQgYW5kIG9ubHkgYXBwbGllZCBpbiBgdGF1cmkgZGV2YCBvciBgdGF1cmkgYnVpbGRgXHJcbiAgLy8gcHJldmVudCB2aXRlIGZyb20gb2JzY3VyaW5nIHJ1c3QgZXJyb3JzXHJcbiAgY2xlYXJTY3JlZW46IGZhbHNlLFxyXG4gIC8vIHRhdXJpIGV4cGVjdHMgYSBmaXhlZCBwb3J0LCBmYWlsIGlmIHRoYXQgcG9ydCBpcyBub3QgYXZhaWxhYmxlXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICBwb3J0OiAxNDIwLFxyXG4gICAgc3RyaWN0UG9ydDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIHRvIG1ha2UgdXNlIG9mIGBUQVVSSV9ERUJVR2AgYW5kIG90aGVyIGVudiB2YXJpYWJsZXNcclxuICAvLyBodHRwczovL3RhdXJpLnN0dWRpby92MS9hcGkvY29uZmlnI2J1aWxkY29uZmlnLmJlZm9yZWRldmNvbW1hbmRcclxuICBlbnZQcmVmaXg6IFsnVklURV8nLCAnVEFVUklfJ10sXHJcbiAgYnVpbGQ6IHtcclxuICAgIC8vIFRhdXJpIHN1cHBvcnRzIGVzMjAyMVxyXG4gICAgdGFyZ2V0OiBwcm9jZXNzLmVudi5UQVVSSV9QTEFURk9STSA9PSAnd2luZG93cycgPyAnY2hyb21lMTA1JyA6ICdzYWZhcmkxMycsXHJcbiAgICAvLyBkb24ndCBtaW5pZnkgZm9yIGRlYnVnIGJ1aWxkc1xyXG4gICAgbWluaWZ5OiAhcHJvY2Vzcy5lbnYuVEFVUklfREVCVUcgPyAndGVyc2VyJyA6IGZhbHNlLFxyXG4gICAgLy8gcHJvZHVjZSBzb3VyY2VtYXBzIGZvciBkZWJ1ZyBidWlsZHNcclxuICAgIHNvdXJjZW1hcDogISFwcm9jZXNzLmVudi5UQVVSSV9ERUJVRyxcclxuICAgIGFzc2V0c0lubGluZUxpbWl0OiAwLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ3N0YXRpYy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICBjb21wcmVzczoge1xyXG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pKVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThSLFNBQVMsb0JBQW9CO0FBQzNULE9BQU8sU0FBUztBQUVoQixPQUFPLFVBQVU7QUFHakIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkI7QUFBQSxFQUNFO0FBQUEsRUFDQTtBQUFBLE9BQ0s7QUFHUCxPQUFPLGtCQUFrQjtBQUN6QixPQUFPLFlBQVk7QUFHbkIsU0FBUyx3QkFBd0I7QUFHakMsU0FBUyxrQkFBa0I7QUFHM0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBRzFCLE9BQU8sYUFBYTtBQTVCcEIsSUFBTSxtQ0FBbUM7QUErQnpDLElBQU0scUJBQXFCLGFBQWEsV0FBVyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBR2hFLElBQU8sc0JBQVEsYUFBYSxhQUFhO0FBQUEsRUFDdkMsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsU0FBUyxDQUFDLE9BQU8sZ0JBQWdCLGdCQUFnQixnQkFBZ0IsU0FBUyxZQUFZO0FBQUEsTUFDdEYsS0FBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLFFBQ1IsU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVc7QUFBQSxRQUNULGNBQWM7QUFBQSxVQUNaLFFBQVE7QUFBQSxVQUNSLG9CQUFvQixDQUFDLE9BQU87QUFBQSxRQUM5QixDQUFDO0FBQUEsUUFDRCx5QkFBeUI7QUFBQSxRQUN6Qix3QkFBd0I7QUFBQSxNQUMxQjtBQUFBLE1BQ0EsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLE1BQ0osYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLE1BQ0wsMEJBQTBCO0FBQUEsTUFDMUIsaUJBQWlCO0FBQUEsTUFDakIsU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLElBQ0QsaUJBQWlCO0FBQUE7QUFBQSxNQUVmLFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxNQUNOLE9BQU87QUFBQSxNQUNQLFdBQVc7QUFBQSxJQUNiLENBQUM7QUFBQSxFQUNIO0FBQUE7QUFBQTtBQUFBLEVBR0EsYUFBYTtBQUFBO0FBQUEsRUFFYixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQSxFQUdBLFdBQVcsQ0FBQyxTQUFTLFFBQVE7QUFBQSxFQUM3QixPQUFPO0FBQUE7QUFBQSxJQUVMLFFBQVEsUUFBUSxJQUFJLGtCQUFrQixZQUFZLGNBQWM7QUFBQTtBQUFBLElBRWhFLFFBQVEsQ0FBQyxRQUFRLElBQUksY0FBYyxXQUFXO0FBQUE7QUFBQSxJQUU5QyxXQUFXLENBQUMsQ0FBQyxRQUFRLElBQUk7QUFBQSxJQUN6QixtQkFBbUI7QUFBQSxJQUNuQixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
