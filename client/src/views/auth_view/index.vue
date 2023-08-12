<template>
  <div class="auth-container">
      <n-card class="auth-card">
        <n-form 
          class="auth-from"
          @submit.prevent="logIn"
          :model="authParams"
        >
          <p class="auth-title">Вход</p>
          <n-form-item 
            label="Логин"
            path="login"
          >
            <n-input
              type="text"
              v-model:value="authParams.login"
              placeholder="Введите ваш логин"
            />
          </n-form-item>
          <n-form-item 
            label="Пароль"
            path="password"
          >
            <n-input
              type="password"
              v-model:value="authParams.password"
              placeholder="Введите ваш пароль"
              show-password-on="click"
            />
          </n-form-item>
          <div class="auth-button">
            <n-button
              type="primary"
              attr-type="submit"
              round
            >
              Войти
            </n-button>
          </div>
        </n-form>
      </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput, NButton } from "naive-ui"
import { inject, ref } from "vue"
import { useUserStore } from "@/store";
import { AuthParams } from "@/entity/employee/params"
import { useApiRequestHandler } from "@/composables/api_request";
import { EmployeeApiWorkerInjectionKey } from '@/api_worker'
import { useRouter } from "vue-router";

const employeeApiWorker = inject(EmployeeApiWorkerInjectionKey)!
const router = useRouter()
const store = useUserStore()

const authParams = ref<AuthParams>({
  login: null,
  password: null
})

const handleLoginRequest = useApiRequestHandler(employeeApiWorker.logIn, authParams.value)
const logIn = async () : Promise<void>  => {  
  const info = await handleLoginRequest()
  store.set_employee_info(info)
  if (info) {
    router.push("/")
  }
}

</script>

<style scoped lang="scss">
  .auth-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .n-card {
      max-width: 500px;
    }

    .auth-title {
      font-size: 18px;
      text-align: center;
      margin-bottom: 10px;
    }

    .auth-button {
      display: flex;
      justify-content: flex-end;
    }
  } 
</style>
