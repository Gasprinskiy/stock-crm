import './assets/style.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './app/index.vue'
import ApiInjection from './api_worker'
import StoreInjection from './storage_worker'

const app = createApp(App)
const pinia = createPinia()

Object.keys(ApiInjection.injection_keys).forEach(injection => {
    app.provide(ApiInjection.injection_keys[injection], ApiInjection.injection_impl[injection])
})

Object.keys(StoreInjection.injection_keys).forEach(injection => {
    app.provide(StoreInjection.injection_keys[injection], StoreInjection.injection_impl[injection])
})

app
.use(router)
.use(pinia)
.mount('#app')

