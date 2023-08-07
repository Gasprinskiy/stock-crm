<template>
  <n-loading-bar-provider>
    <n-notification-provider>
      <app/>
    </n-notification-provider>
  </n-loading-bar-provider>
</template>

<script setup lang="ts">
import { NNotificationProvider, NLoadingBarProvider } from 'naive-ui'
import app from './app.vue'
</script>
