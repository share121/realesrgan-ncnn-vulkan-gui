<script lang="ts" setup>
import gsap from 'gsap'
const props = withDefaults(
  defineProps<{
    content?: string
  }>(),
  {
    content: ''
  }
)
const text = computed(() => [...props.content])
const spans: Ref<HTMLSpanElement[]> = ref([])
onMounted(() => {
  let tl = gsap.timeline()
  tl.from(
    spans.value,
    {
      duration: 1,
      stagger: 2.5 / 30,
      y: '0.7em',
      ease: 'back.out(3)'
    },
    '<'
  )
  tl.from(
    spans.value,
    {
      duration: 1,
      stagger: 2.5 / 30,
      x: '2em',
      ease: 'power2.out'
    },
    '<'
  )
  tl.to(
    spans.value,
    {
      duration: 1,
      stagger: 2.5 / 30,
      opacity: 1,
      ease: 'power2.out'
    },
    '<'
  )
})
</script>

<template>
  <span class="inline-block opacity-0 transition-none" v-for="i in text" ref="spans">{{ i }}</span>
</template>
