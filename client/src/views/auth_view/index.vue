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
import { NCard, NForm, NFormItem, NInput, NButton } from "naive-ui"
import { inject, ref } from "vue"
import { useStore } from "vuex"
import { AuthParams } from "../../entity/employee/params"
import { useApiRequestHandler } from "../../composables/api_request";
import mutationTypes from "../../store/mutation/types";
import apiInjectionMap from '../../api_worker'
import { useRouter } from "vue-router";

const employeeApiWorker = inject(apiInjectionMap.employee.key)
const router = useRouter()
const store = useStore()

const authParams = ref<AuthParams>({
  login: null,
  password: null
})

const handleLoginRequest = useApiRequestHandler(employeeApiWorker.logIn, authParams.value)
const logIn = async () => {  
  const info = await handleLoginRequest()
  store.commit(mutationTypes.SET_EMPLOYEE_INFO, info)
  if (info) {
    router.push("/")
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
