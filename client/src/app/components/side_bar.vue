<template>
    <n-layout 
        class="sider-layout"
        has-sider
    >
        <n-layout-sider 
            bordered
            :width="240"
        >
            <n-menu
                v-model:value="routeName"
                :options="menuOptions"
                key-field="key"
                label-field="lebel"
            />
        </n-layout-sider>
    </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutSider, NIcon, NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui'
import { Component, h, ref } from 'vue';
import { HomeOutline } from "@vicons/ionicons5";
import { useRoute } from 'vue-router';

// const emit = defineEmits(["update"])

const route = useRoute()

const routeName = ref<string>(route.name)

function renderIcon (icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    lebel: 'Главная',
    key: 'Home',
    icon: renderIcon(HomeOutline)
  },
]
</script>

<style scoped lang="scss">
  .sider-layout {
    height: 100%;
  }
</style>