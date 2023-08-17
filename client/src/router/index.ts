import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/auth_view/index.vue'
import HomeView from '@/views/home_view/index.vue'
import StockView from '@/views/stocks_view/index.vue'

const routes = [
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
    {
        path: "/stocks",
        name: "Stocks",
        component: StockView,
        children: [
            {
                path: "/stocks/:id",
                name: "Chosen stock",
                component: StockView,
            }
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router