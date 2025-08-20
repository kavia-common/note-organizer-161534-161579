<template>
  <div class="app-root">
    <NuxtRouteAnnouncer />
    <AppLayout />
  </div>
</template>

<script setup lang="ts">
/**
 * Root app simply mounts the AppLayout which contains the sidebar and the main area.
 */
</script>

<style>
html, body, #__nuxt {
  height: 100%;
}
.app-root {
  min-height: 100%;
}
</style>
