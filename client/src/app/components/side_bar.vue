<template>
  <n-layout
    class="sider-layout"
    has-sider
  >
    <n-layout-sider 
      bordered
      :width="300"
    >
      <n-menu
        class="layout-sider"
        :options="menuOptions"
        key-field="key"
        label-field="lebel"
        :icon-size="25"
        @update:value="menuUpdateEvent"
      />
    </n-layout-sider>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayoutSider, NLayout, NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui'
import { computed } from 'vue';
import { Product } from "@vicons/carbon";
import { HomeOutline, CashOutline, PersonOutline } from "@vicons/ionicons5";
import { ConnectionTwoWay, ListDropdown } from "@vicons/carbon"
import { useRenderIcon } from "@/composables/render_icon"
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { AccessRight } from '@/entity/employee/constant';

const store = useUserStore()
const router = useRouter()
const route = useRoute()
const renderIcon = useRenderIcon()

const menuOptions = computed((): MenuOption[] => {
  return [
    {
      lebel: 'Главная',
      key: '/',
      icon: renderIcon(HomeOutline)
    },
    {
      lebel: 'Продажи',
      key: '/sales',
      show: store.check_acces_right(AccessRight.stock_manager, AccessRight.seller),
      icon: renderIcon(CashOutline),
    },
    {
      lebel: 'Товары',
      key: '/products',
      show: store.check_acces_right(AccessRight.stock_manager, AccessRight.stock_worker),
      icon: renderIcon(Product),
    },
    {
      lebel: 'Прием/распределениe',
      key: '/distribution',
      show: store.check_acces_right(AccessRight.distributor),
      icon: renderIcon(ConnectionTwoWay),
      disabled: true
    },
    {
      lebel: 'Работники',
      key: '/employee',
      show: store.check_acces_right(AccessRight.stock_manager),
      icon: renderIcon(PersonOutline),
      disabled: true
    },
    {
      lebel: 'Вариации товара',
      key: '/distribution',
      show: store.check_acces_right(AccessRight.distributor),
      icon: renderIcon(ListDropdown),
      disabled: true
    },
  ]
})

const menuUpdateEvent = (key: string) : void => {  
  if (key !== route.path) {
    router.push(key)
  }
}

</script>

<style scoped lang="scss">
  .sider-layout {
    position: absolute;
    width: $side-bar-width;
    height: calc(100% - $header-height);
    top: $header-height;
    .layout-sider {
      margin-top: 15px;
    }
  }
</style>