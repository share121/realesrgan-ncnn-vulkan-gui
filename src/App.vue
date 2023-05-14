<script lang="ts" setup>
useDark()
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="(route.meta.transition as string | undefined) ?? 'fade'">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>
