<template>
  <div class="container">
    <div class="router-view" v-if="showRouterView">
      <side-bar v-if="notAuthRoute"/>
      <router-view/>
    </div>
    <connection-error
      v-if="hasConnectionError"
      @update="getEmployeeInfo"
    />
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeMount, computed, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useNotification, useLoadingBar } from 'naive-ui';
import { useApiRequestHandler } from "../composables/api_request";
import { useUserStore } from "../store/"

import { EmployeeApiWorkerInjectionKey } from '../api_worker'
import appBus from "../shared/app-bus";

import ConnectionError from "./components/connection_error.vue"
import SideBar from "./components/side_bar.vue"

const employeeApiWorker = inject(EmployeeApiWorkerInjectionKey)!
const router = useRouter()
const route = useRoute()
const store = useUserStore()
const notification = useNotification()
const loading = useLoadingBar()

const hasConnectionError = ref<boolean>(false)
const apiRequestDone = ref<boolean>(false)

const notAuthRoute = computed(() => route.name !== "Auth")
const showRouterView = computed(() => apiRequestDone.value && !hasConnectionError.value)

const handlerEmployeeInfoRequest = useApiRequestHandler(employeeApiWorker.getEmployeeInfo)
const getEmployeeInfo = async () : Promise<void> => {
  const info = await handlerEmployeeInfoRequest()
  store.set_employee_info(info)
}

appBus.on('unauthorized-api-request', () => {  
  if (notAuthRoute.value) {
    notification.warning({
      title: "Необходимо авторизоватся в системе",
      duration: 3000,
      keepAliveOnHover: true,
    })
    router.push("/auth")
  }
})

appBus.on('no-acces-api-request', () => {
  notification.warning({
    title: "Нет прав доступа",
    duration: 3000,
    keepAliveOnHover: true,
  })
  router.back()
})

appBus.on('session-expired', () => {
  notification.warning({
    title: "Требуется повторная авторизация",
    duration: 3000,
    keepAliveOnHover: true,
  })
  router.push("/auth")
})

appBus.on('api-request-started', () => {
  loading.start()
  apiRequestDone.value = false
})

appBus.on('api-request-finished-successful', () => {
  loading.finish()
  appBus.all.clear()
  apiRequestDone.value = true
  hasConnectionError.value = false
})

appBus.on('api-request-finished-unsuccessful', () => {
  loading.error()
  appBus.all.clear()
  apiRequestDone.value = true
  hasConnectionError.value = false
})

appBus.on('network-error', () => {
  loading.error()
  hasConnectionError.value = true
})

onBeforeMount(async () => await getEmployeeInfo())

</script>

<style scoped lang="scss">
  .router-view {
    width: 100%;
    height: 100%;
    display: flex;
  }
</style>