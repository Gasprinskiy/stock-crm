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
              v-model:value="routePath"
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
import { NLayout, NLayoutSider, NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui'
import { computed, ref } from 'vue';
import { HomeOutline, GridOutline, CashOutline } from "@vicons/ionicons5";
import { ConnectionTwoWay, ListDropdown } from "@vicons/carbon"

import { useRenderIcon } from "../../composables/render_icon"
// import { useApiRequestHandler } from '../../composables/api_request';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../store';

// import { StockApiWorkerInjectionKey } from "../../api_worker/"
import { AccessRight } from '../../entity/employee/constant';

// const props = 
const store = useUserStore()
const router = useRouter()
const route = useRoute()
const renderIcon = useRenderIcon()
// const stockApiWorker = inject(StockApiWorkerInjectionKey)!

const routePath = ref(route.path)

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
      lebel: 'Список складов',
      key: '/stocks',
      show: store.check_acces_right(AccessRight.stock_manager, AccessRight.stock_worker),
      icon: renderIcon(GridOutline),
    },
    {
      lebel: 'Прием/распределениe',
      key: '/distribution',
      show: store.check_acces_right(AccessRight.distributor),
      icon: renderIcon(ConnectionTwoWay),
    },
    {
      lebel: 'Вариации товара',
      key: '/distribution',
      show: store.check_acces_right(AccessRight.distributor),
      icon: renderIcon(ListDropdown),
    },
  ]
})

// const findEmployeeStocks = useApiRequestHandler(stockApiWorker.findEmployeeStockList)
// const prepareStockList = async () : Promise<void> => {
//   const response = await findEmployeeStocks()
//   if (response) {
//     stockList.value = response.map(item => {
//       return {
//         key: `/stocks/${item.stock_id}`,
//         lebel: item.name,
//         icon: renderIcon(GridOutline)
//       }
//     })
//   }
// }

const menuUpdateEvent = (key: string) : void => {  
  if (key !== route.path) {
    router.push(key)
  }
}

// onBeforeMount(async () => await prepareStockList())

</script>

<style scoped lang="scss">
  .sider-layout {
    height: 100%;
  }
</style>