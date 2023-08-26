<template>
  <common-template
    :icon="CartOutline"
    :title="title"
  >
    <n-card
      class="sell-tabs height-100"
    >
      <n-tabs
        class="height-100"
        v-model:value="currentTab"
        type="card"
        :addable="addable"
        :closable="clossable"
        @add="addTab"
        @close="warnTabRemove"
      >
        <n-tab-pane
          class="height-100"
          v-for="tab in tabsList"
          display-directive="if"
          :key="tab.key"
          :name="tab.key"
          :tab="tabName(tab.key)"
        >
          <component 
            :is="tab.component"
            :receipt-id="tab.key"
            :stock-id="stockId"
          />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </common-template>
</template>

<script setup lang="ts">
import { NCard, NTabs, NTabPane, useDialog } from "naive-ui";
import { useRoute } from "vue-router";
import { ref, computed, h, inject, onBeforeMount } from "vue";
import { CartOutline } from "@vicons/ionicons5";
import { SaleTab } from "@/entity/sales/entity/";
import { CartStorageInjectionKey } from "@/storage_worker/";
import CommonTemplate from "@/templates/ViewCommonTemplate.vue";
import SellReceipt from "@/views/sell_product_view/components/sell_receipt.vue"

const cartStorage = inject(CartStorageInjectionKey)!

const route = useRoute()
const dialog = useDialog()

const currentTab = ref<number>(1)
const tabsList = ref<SaleTab[]>([
  {
    key: 1,
    component: h(SellReceipt)
  }
])

const stockId = Number(route.params.stock_id)

const title = computed(() => `Продать со склада №${route.params.stock_id}`)
const addable = computed(() => {
  return {
    disabled: tabsList.value.length >= 10
  }
})
const clossable = computed(() => {
  return tabsList.value.length > 1
})

const tabName = (key: number) : string => {
  return `Чек №${key}`
}

const addTab = async () : Promise<void> => {
  const newTab : SaleTab = {
    key: tabsList.value[tabsList.value.length -1].key + 1,
    component: h(SellReceipt)
  }
  await cartStorage.saveReceipt(newTab.key, stockId, null)

  tabsList.value.push(newTab)
  currentTab.value = newTab.key
}

const warnTabRemove = (key: number) : void => {
  dialog.warning({
    title: "Закрыть вкладку?",
    content: "Все не сохраненные данные будут удалены",
    positiveText: "Да",
    onPositiveClick: () => removeTab(key)
  })
}

const removeTab = async (key: number) : Promise<void>=> {
  const removeTabIndex = tabsList.value.findIndex(item => item.key === key)
  const removeTabKey = tabsList.value[removeTabIndex].key

  if (removeTabKey === currentTab.value) {
    currentTab.value = removeTabKey - 1
  }

  await cartStorage.removeReceipt(removeTabKey, stockId)
  tabsList.value.splice(removeTabIndex, 1)
}

const loadReceiptTabsFromStorage = async () : Promise<void> => {
  const list = await cartStorage.getReceiptsIdList(stockId)

  if (list) {
    tabsList.value = []

    list.forEach(id => {
      tabsList.value.push({
        key: id,
        component: h(SellReceipt)
      })
    })

    currentTab.value = list[0]
  }
}

// const fuck = (key: any) => {
//   console.log(key);
  
// }

onBeforeMount(async () => await loadReceiptTabsFromStorage())

</script>

<style scoped lang="scss">
  .sell-tabs {
    overflow: hidden;
  }
</style>