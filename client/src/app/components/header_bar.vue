<template>
    <n-layout-header
        class="layout-header"
        bordered
    >
        <div class="header-logo">
            <img src="@/assets/logo.svg">
        </div>
        <n-dropdown 
            :options="menuOptions"
            @select="handleOptionSelect"
        >
            <n-button round>
                <template #icon>
                    <n-icon size="25">
                        <PersonCircleOutline/>
                    </n-icon>
                </template>
                {{ store.employeeInfo?.login }}
            </n-button>
        </n-dropdown>
    </n-layout-header>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { NLayoutHeader, NIcon, NButton, NDropdown } from 'naive-ui';
import type { MenuOption } from 'naive-ui'
import { PersonCircleOutline, LogOutOutline } from "@vicons/ionicons5";

import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from "@/store/"
import { useRenderIcon } from '@/composables/render_icon';
import { useApiRequestHandler } from '@/composables/api_request';

import { EmployeeApiWorkerInjectionKey } from '@/api_worker'

const props = defineProps({
    employeeLogin: String
})
const store = useUserStore()
const router = useRouter()
const route = useRoute()
const renderIcon = useRenderIcon()
const employeeApiWorker = inject(EmployeeApiWorkerInjectionKey)!

const menuOptions = ref<MenuOption[]>([
    {
        label: "Профиль",
        key: "/employee_profile",
        icon: renderIcon(PersonCircleOutline),
    },
    {
        label: "Выйти",
        key: "/log_out",
        icon: renderIcon(LogOutOutline),
    }
])

const logOut = useApiRequestHandler(employeeApiWorker.logOut)
const handleOptionSelect = async (key: string) : Promise<void> => {
    switch (key) {
        case "/log_out":
            await logOut()
            store.$reset()
            router.push("/auth")
            break;
        default:
            if (key !== route.path) {
                router.push(key)
            }
            break;
    }
}
</script>

<style scoped lang="scss">
  .layout-header {
    width: 100%;
    height: $header-height;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-logo {
        width: 120px;
        display: flex;
        align-items: center;
        img {
            width: 100%;
            height: 100%;
        }
    }
  }
</style>