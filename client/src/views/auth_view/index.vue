<template>
  <div class="auth-container full-centered">
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
import { NCard, NForm, NFormItem, NInput, NButton, useNotification, NSkeleton } from "naive-ui"
import { inject, ref } from "vue"
import { useRouter } from "vue-router"
import apiInjectionMap from '../../api-worker'
import { AuthParams } from "../../entity/employee/params"

const employeeApiWorker = inject(apiInjectionMap.employee.key)
const notification = useNotification()
const router = useRouter()

const authParams = ref<AuthParams>({
  login: null,
  password: null
})

const logIn = async () => {
  try {
    await employeeApiWorker.logIn(authParams.value)
    // state.commit("SAVE_EMPLOYEE_INFO", response)    
    router.push("/")
  } catch(err: any) {
    notification.error({
      content: err,
      duration: 3000,
      keepAliveOnHover: true,
    })
  }
}

</script>

<style scoped lang="scss">
  .auth-container {
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
