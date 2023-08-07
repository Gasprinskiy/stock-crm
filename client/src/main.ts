import './assets/style.scss'
import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './app/index.vue'
import apiInjectionMap from './api_worker'

const app = createApp(App)

Object.keys(apiInjectionMap).forEach(injection => {
    app.provide(apiInjectionMap[injection].key, apiInjectionMap[injection].implementation)
})

app
.use(router)
.use(store)
.mount('#app')
