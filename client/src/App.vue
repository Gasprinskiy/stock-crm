<template>
  <n-notification-provider>
    <div class="contariner">
      <router-view/>
    </div>
  </n-notification-provider>
</template>

<script setup lang="ts">
import { NNotificationProvider } from 'naive-ui'
import { inject, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import apiInjectionMap from './api-worker'

const employeeApiWorker = inject(apiInjectionMap.employee.key)
const router = useRouter()

const isAuth = async () => {
  try {
    await employeeApiWorker.isAuth()
  } catch(err: any) {
    router.push({
      name: "Auth"
    })
  }
}

router.beforeEach(async (to, from) => {
  if (to.name !== "Auth") {
    await isAuth()
  }
})

</script>

<style scoped>

</style>
