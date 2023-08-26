<template>
  <n-loading-bar-provider>
    <n-notification-provider>
      <n-dialog-provider>
        <app/>
      </n-dialog-provider>
    </n-notification-provider>
  </n-loading-bar-provider>
</template>

<script setup lang="ts">
import { NNotificationProvider, NLoadingBarProvider, NDialogProvider } from 'naive-ui'
import app from '@/app/app.vue'
</script>
