<script lang="ts" setup>
import { invoke } from '@tauri-apps/api'
import { resolve, basename, extname } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/api/dialog'
import { useConfigStore } from '@/stores/config'
import { appWindow } from '@tauri-apps/api/window'
import type { FileDropEvent } from '@tauri-apps/api/window'
import mime from 'mime'

const { scale, modelName, outputDir, realesrganNcnnVulkanDir } = storeToRefs(useConfigStore())

window.addEventListener('load', () => {
  appWindow.show()
})

async function startWork(id: number) {
  let file = files.find((e) => e.id === id)
  if (file) {
    file.isWorking = !file.isWorking
    file.progress = 0
    if (file.id_temp) {
      appWindow.emit(file.id_temp + 'stop')
    }
    file.id_temp = undefined
    if (file.unlisten) {
      file.unlisten()
    }
    file.unlisten = undefined
    if (file.isWorking) {
      file.errMsg = ''
      let path = file.path
      let id_temp = (file.id_temp = `${id}-${window.crypto.randomUUID()}-${+new Date()}`)
      file.unlisten = await appWindow.listen<{
        data: string
      }>(id_temp, ({ payload: { data } }) => {
        if (file?.id_temp === id_temp) {
          if (data) {
            let n = data.match(/^([0-9]+(\.[0-9]+)?)\s*%$/)?.[1]
            if (n) {
              file.progress = +n / 100
            }
          }
        }
      })
      invoke('start_work', {
        window: appWindow,
        realesrganNcnnVulkanPath: realesrganNcnnVulkanDir.value,
        inputPath: path,
        outputPath: await resolve(outputDir.value, await basename(path)),
        scale: scale.value,
        modelName: modelName.value,
        id: id_temp
      })
        .then(() => {
          if (file?.id_temp === id_temp) {
            file.progress = 1
            file.isWorking = false
          }
        })
        .catch((e) => {
          if (file?.id_temp === id_temp) {
            file.errMsg = e
            console.error(e)
          }
        })
        .finally(() => {
          if (file?.id_temp === id_temp) {
            file.unlisten?.()
            file.unlisten = undefined
            file.id_temp = undefined
          }
        })
    }
  }
}
const files: {
  path: string
  base64: Ref<string>
  id: number
  type: string
  stype: string
  progress: number
  isWorking: boolean
  errMsg: string
  id_temp?: string
  unlisten?: Function
}[] = reactive([])
async function uploadFiles() {
  let selected = await open({
    multiple: true,
    filters: [
      {
        name: '图像和视频',
        extensions: ['png', 'jpeg', 'jpg', 'webp', 'mp4']
      },
      {
        name: '图像',
        extensions: ['png', 'jpeg', 'jpg', 'webp']
      },
      {
        name: '视频',
        extensions: ['mp4']
      }
    ]
  })
  if (selected !== null) {
    if (!Array.isArray(selected)) selected = [selected]
    selected.forEach(async (e, i) => {
      let type = mime.getType(await extname(e)) ?? ''
      let base64 = ref('')
      invoke('file_to_base64', {
        path: e
      }).then((e) => {
        // @ts-ignore
        base64.value = `data:${type};base64,${e}`
      })
      setTimeout(() => {
        files.push({
          path: e,
          base64,
          type,
          stype: type.split('/')[0],
          id: files.length && Math.max(...files.map((e) => e.id)) + 1,
          isWorking: false,
          progress: 0,
          errMsg: ''
        })
      }, i * 100)
    })
  }
  console.log(files)
}
function deleteFile(id: number) {
  const start = files.findIndex((e) => e.id === id)
  if (start !== -1) {
    if (files[start].isWorking) {
      startWork(id)
    }
    files.splice(start, 1)
  }
}
async function setSavePath() {
  const selected = await open({
    directory: true
  })
  if (selected) outputDir.value = selected as string
}
async function setRealesrganNcnnVulkanPath() {
  const selected = await open()
  if (selected) realesrganNcnnVulkanDir.value = selected as string
}
const fileInput: Ref<HTMLElement | null> = ref(null)
const outputDirEl: Ref<HTMLElement | null> = ref(null)
const { x, y } = useMouse({ type: 'client' })
const { element } = useElementByPoint({ x, y })
function wait(timeout = 0) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeout)
  })
}
appWindow.listen<FileDropEvent>('tauri://file-drop', async ({ payload }) => {
  await wait(100)
  let selected = payload as unknown as string[]
  console.log(x, y, element.value)
  if (element.value === fileInput.value) {
    selected.forEach(async (e, i) => {
      let type = mime.getType(await extname(e)) ?? ''
      let stype = type.split('/')[0]
      if (['image', 'video'].includes(stype)) {
        let base64 = ref('')
        invoke('file_to_base64', {
          path: e
        }).then((e) => {
          // @ts-ignore
          base64.value = `data:${type};base64,${e}`
        })
        setTimeout(() => {
          files.push({
            path: e,
            base64,
            type,
            stype: type.split('/')[0],
            id: files.length && Math.max(...files.map((e) => e.id)) + 1,
            isWorking: false,
            progress: 0,
            errMsg: ''
          })
        }, i * 100)
      }
    })
  }
  if (element.value === outputDirEl.value) {
    outputDir.value = selected[0]
  }
  console.log(payload, files)
})
</script>

<template>
  <main class="flex h-full flex-col gap-4 overflow-auto py-5">
    <!-- 上传文件 -->
    <div class="mx-5">
      <label
        class="relative mx-auto mt-2 flex w-full max-w-screen-sm flex-col items-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 text-center dark:border-gray-700 dark:bg-gray-800"
      >
        <solar-cloud-upload-linear class="text-3xl"></solar-cloud-upload-linear>
        <h2 class="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">上传文件</h2>
        <p class="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
          可批量上传、拖拽上传，支持视频、图片
        </p>
        <input
          @click.prevent="uploadFiles"
          ref="fileInput"
          title=""
          type="file"
          class="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
          multiple
          accept=".png,.jpg,.webp,.mp4"
        />
      </label>
    </div>
    <!-- 上传文件 -->

    <!-- 配置 -->
    <div class="mx-auto grid w-full max-w-screen-sm grid-cols-2 gap-4 px-5">
      <div>
        <label class="block text-sm text-gray-500 dark:text-gray-300">
          放大倍数
          <select
            v-model="scale"
            class="mt-2 block w-full appearance-none rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 placeholder-gray-400/70 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-blue-300"
          >
            <option value="2">2x</option>
            <option value="3">3x</option>
            <option value="4" selected>4x</option>
          </select>
        </label>
      </div>
      <div>
        <label class="block text-sm text-gray-500 dark:text-gray-300">
          放大模型
          <select
            v-model="modelName"
            class="mt-2 block w-full appearance-none rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 placeholder-gray-400/70 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-blue-300"
          >
            <option value="realesr-animevideov3">realesr-animevideov3</option>
            <option value="realesrgan-x4plus">realesrgan-x4plus</option>
            <option value="realesrgan-x4plus-anime">realesrgan-x4plus-anime</option>
            <option value="realesrnet-x4plus">realesrnet-x4plus</option>
          </select>
        </label>
      </div>
      <div>
        <label class="block text-sm text-gray-500 dark:text-gray-300">
          输出路径
          <input
            v-model="outputDir"
            ref="outputDirEl"
            @dblclick="setSavePath"
            type="text"
            placeholder="输出文件夹的路径"
            title="输出文件夹的路径，双击选择路径"
            class="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 placeholder-gray-400/70 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-blue-300"
          />
        </label>
      </div>
      <div>
        <label class="block text-sm text-gray-500 dark:text-gray-300">
          realesrgan 路径
          <input
            v-model="realesrganNcnnVulkanDir"
            @dblclick="setRealesrganNcnnVulkanPath"
            type="text"
            placeholder="realesrgan-ncnn-vulkan 的路径"
            title="realesrgan-ncnn-vulkan 的路径，双击选择路径"
            class="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 placeholder-gray-400/70 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-blue-300"
          />
        </label>
      </div>
      <button
        class="col-span-full transform rounded-lg bg-blue-600 px-6 py-2 font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
        @click="files.forEach((e) => startWork(e.id))"
      >
        全部启动
      </button>
    </div>
    <!-- 配置 -->

    <!-- 处理文件 -->
    <div class="mx-5">
      <TransitionGroup
        name="list"
        tag="div"
        class="mx-auto w-full max-w-screen-sm"
        @before-leave="(el)=>((el:HTMLElement)=>{el.style.width=el.getBoundingClientRect().width+'px'})(el as HTMLElement)"
      >
        <div
          v-for="file in files"
          :key="file.id"
          class="flex items-center justify-between gap-4 rounded-xl p-5 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <!-- 预览图 -->
          <div
            class="h-24 w-24 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700"
            :title="file.path"
          >
            <img
              v-if="file.stype === 'image'"
              :src="file.base64 as unknown as string"
              :alt="file.path"
              class="h-full w-full object-cover opacity-0"
              @load=";($event.target as HTMLElement).style.opacity = '1'"
            />
            <video
              v-else-if="file.stype === 'video'"
              :src="file.base64 as unknown as string"
              class="h-full w-full object-cover opacity-0"
              preload="metadata"
              @loadedmetadata=";($event.target as HTMLElement).style.opacity = '1'"
            >
              {{ file.path }}
            </video>
          </div>
          <!-- 预览图 -->
          <!-- 进度条 -->
          <div class="relative flex flex-1" :title="`进度：${file.progress * 100}%`">
            <div class="absolute -top-1 left-0 flex w-full -translate-y-full justify-between">
              <div>进度</div>
              <div>{{ (file.progress * 100).toFixed(2) }} %</div>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                class="h-full rounded-full"
                :class="{
                  'bg-blue-500': !file.errMsg,
                  'dark:bg-blue-600': !file.errMsg,
                  'bg-pink-500': file.errMsg,
                  'dark:bg-pink-600': file.errMsg
                }"
                :style="{ width: file.progress * 100 + '%' }"
              ></div>
            </div>
          </div>
          <!-- 进度条 -->
          <!-- 操作 -->
          <div class="flex gap-2">
            <div
              class="flex cursor-pointer items-center p-1 text-xl hover:text-pink-600 dark:hover:text-pink-500"
              :title="file.errMsg"
              v-if="file.errMsg"
            >
              <solar-info-circle-linear></solar-info-circle-linear>
            </div>
            <div
              class="flex cursor-pointer items-center p-1 text-xl hover:text-pink-600 dark:hover:text-pink-500"
              title="删除"
              @click="deleteFile(file.id)"
            >
              <solar-trash-bin-2-linear></solar-trash-bin-2-linear>
            </div>
            <div
              class="flex cursor-pointer items-center p-1 hover:text-blue-600 dark:hover:text-blue-500"
              :title="file.isWorking ? '暂停' : '开始'"
              @click="startWork(file.id)"
            >
              <solar-pause-linear v-if="file.isWorking"></solar-pause-linear>
              <solar-play-linear v-else></solar-play-linear>
            </div>
          </div>
          <!-- 操作 -->
        </div>
      </TransitionGroup>
    </div>
    <!-- 处理文件 -->
  </main>
</template>

<style scoped>
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>
