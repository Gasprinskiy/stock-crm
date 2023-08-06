<template>
  <n-loading-bar-provider>
    <n-notification-provider>
      <div class="contariner">
        <App/>
      </div>
    </n-notification-provider>
  </n-loading-bar-provider>
</template>

<script setup lang="ts">
import { NNotificationProvider, NLoadingBarProvider } from 'naive-ui'
import App from './App.vue'
</script>
