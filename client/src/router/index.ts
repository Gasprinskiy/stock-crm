import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/auth-view/index.vue'
import HomeView from '../views/home-view/index.vue'

const defaultRoutes = [
    {
        path: "/",
        name: "Home",
        component: HomeView,
    },
    {
        path: "/auth",
        name: "Auth",
        component: AuthView,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: defaultRoutes
})

export default router