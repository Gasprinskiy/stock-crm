<template>
  <div class="container">
    <div class="router-view">
      <router-view v-if="showRouterView"/>
    </div>
    <div 
      v-if="hasConnectionError" 
      class="connetion-error full-centered"
    >
      <n-empty
        class="full-centered" 
        description="Что-то пошло не так"
      >
        <template #icon>
          <n-icon>
            <EmojiSad24Regular/>
          </n-icon>
        </template>
        <template #extra>
          <p class="extra">
            Проблемы соеденения с сервером
          </p>
          <n-button
            @click="getEmployeeInfo"
          >
            Обновить
          </n-button>
        </template>
      </n-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeMount, computed, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useNotification, useLoadingBar } from 'naive-ui';
import { useStore } from "vuex";
import { NEmpty, NButton, NIcon } from 'naive-ui';
import { EmojiSad24Regular } from "@vicons/fluent"
import apiInjectionMap from './api-worker'
import appBus from "./shared/app-bus";
import mutationTypes from "./store/mutation/types";

const employeeApiWorker = inject(apiInjectionMap.employee.key)
const router = useRouter()
const route = useRoute()
const store = useStore()
const notification = useNotification()
const loading = useLoadingBar()

const hasConnectionError = ref<boolean>(false)
const apiRequestDone = ref<boolean>(false)

const notAuthRoute = computed(() => route.name !== "Auth")
const showRouterView = computed(() => apiRequestDone.value && !hasConnectionError.value)


const getEmployeeInfo = async () => {
  const response = await employeeApiWorker.getEmployeeInfo()
  if (response) {
    store.commit(mutationTypes.SET_EMPLOYEE_INFO, response) 
  }
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
  }

  .connetion-error {
    .extra {
      color: var(--n-text-color);
      font-size: 14px;
      min-width: 250px;
      margin-bottom: 10px;
    }
  }
</style>
