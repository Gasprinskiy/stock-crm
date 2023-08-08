import './assets/style.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './app/index.vue'
import { InjectionKeysMap, InjectionImplMap } from './api_worker'

const app = createApp(App)
const pinia = createPinia()

Object.keys(InjectionKeysMap).forEach(injection => {
    app.provide(InjectionKeysMap[injection], InjectionImplMap[injection])
})

app
.use(router)
.use(pinia)
.mount('#app')

