<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title?: string
    content?: string
    type?: 'success' | 'info' | 'warning' | 'error'
    isFull?: boolean
  }>(),
  {
    title: '',
    content: '',
    type: 'info',
    isFull: false
  }
)
const emits = defineEmits(['close'])

const color = computed(() => {
  switch (props.type) {
    case 'success':
      return 'emerald'
    case 'info':
      return 'blue'
    case 'warning':
      return 'yellow'
    case 'error':
      return 'red'
  }
})
const isShow = ref(true)
function close(e: MouseEvent) {
  emits('close', e)
  isShow.value = false
}
</script>

<template>
  <template v-if="isShow">
    <div v-if="false">
      <span class="bg-blue-400"></span>
      <span class="bg-blue-500"></span>
      <span class="bg-emerald-400"></span>
      <span class="bg-emerald-500"></span>
      <span class="bg-red-400"></span>
      <span class="bg-red-500"></span>
      <span class="bg-yellow-400"></span>
      <span class="bg-yellow-500"></span>
    </div>
    <!-- full width -->
    <div v-if="props.isFull" class="w-full text-white" :class="[`bg-${color}-500`]">
      <div class="container mx-auto flex items-center justify-between px-6 py-4">
        <div class="flex">
          <slot name="image">
            <svg viewBox="0 0 40 40" class="h-6 w-6 fill-current">
              <path
                v-if="props.type === 'success'"
                d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
              />
              <path
                v-else-if="props.type === 'info'"
                d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
              />
              <path
                v-else-if="props.type === 'warning'"
                d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
              />
              <path
                v-else-if="props.type === 'error'"
                d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
              />
            </svg>
          </slot>
          <p class="mx-3">
            <slot> {{ content }}</slot>
          </p>
        </div>
        <button
          class="transform rounded-md p-1 transition-colors duration-300 hover:bg-gray-600 hover:bg-opacity-25 focus:outline-none"
          @click="close"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 18L18 6M6 6L18 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- pop -->
    <div
      v-else
      class="flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800"
    >
      <div class="flex w-12 flex-shrink-0 items-center justify-center" :class="[`bg-${color}-500`]">
        <slot name="image">
          <svg
            class="h-6 w-6 fill-current text-white"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              v-if="props.type === 'success'"
              d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
            />
            <path
              v-else-if="props.type === 'info'"
              d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
            />
            <path
              v-else-if="props.type === 'warning'"
              d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
            />
            <path
              v-else-if="props.type === 'error'"
              d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
            />
          </svg>
        </slot>
      </div>

      <div class="-mx-3 px-4 py-2">
        <div class="mx-3">
          <span class="font-semibold" :class="[`text-${color}-500`, `dark:text-${color}-400`]">
            <slot name="title">{{ title }}</slot>
          </span>
          <p class="text-sm text-gray-600 dark:text-gray-200">
            <slot> {{ content }}</slot>
          </p>
        </div>
      </div>
    </div>
  </template>
</template>
