import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/auth_view/index.vue'
import HomeView from '@/views/home_view/index.vue'
import ProductsView from '@/views/product_view/index.vue'
import SalesView from '@/views/sales_view/index.vue'
import SellProductView from '@/views/sell_product_view/index.vue'

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
        path: "/products",
        name: "Products",
        component: ProductsView,
    },
    {
        path: "/sales",
        name: "Sales",
        component: SalesView,
    },
    {
        path: "/sell/:stock_id",
        name: "Sell product",
        component: SellProductView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router