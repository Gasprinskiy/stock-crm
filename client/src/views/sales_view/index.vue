<template>
  <router-view/>
  <common-template
    :icon="CashOutline"
    title="Продажи"
  >
    <div>
      <n-data-table
        :data="data || []"
        :columns="dataTableColumns || []"
      />
      <n-pagination
        class="tabel-pagination"
        v-model:page="paginationParams.page"
        v-model:page-size="paginationParams.pageSize"
        @update-page="loadData"
        @update-page-size="loadData"
        :page-count="pageCount"
        :page-sizes="pageSizeOptions"
        show-size-picker
      />
    </div>
  </common-template>
</template>

<script setup lang="ts">
import { 
  NDataTable, 
  type DataTableColumns,
  type PaginationSizeOption,
  type MenuOption,
  NPagination,
  NDropdown, 
  NTag, 
  NButton,
  NNumberAnimation
} from "naive-ui";
import { CashOutline, ListOutline, CartOutline } from "@vicons/ionicons5";
// import { History20Regular } from "@vicons/fluent";
import { inject, ref, onBeforeMount, h, computed } from "vue";
import { StockApiWorkerInjectionKey } from "@/api_worker";
import { useApiRequestHandler } from "@/composables/api_request";
import type { Stock, StockSaleStats } from "@/entity/stock/entity";
import { useRouter } from "vue-router";
import { useRenderIcon } from '@/composables/render_icon';
import CommonTemplate from "@/templates/ViewCommonTemplate.vue";

const stocksApiWorker = inject(StockApiWorkerInjectionKey)!
const handleDataLoad = useApiRequestHandler(stocksApiWorker.findSalesStatStockListByEmployeeID)
const renderIcon = useRenderIcon()
const router = useRouter()

const data = ref<Stock[] | null>(null)
const dataTableColumns = ref<DataTableColumns<StockSaleStats> | null>(null)
const pageCount = ref<number>(0)
const paginationParams = ref({
  page: 1,
  pageSize: 10,
})

const pageSizeOptions : PaginationSizeOption[] = [
  {
    label: "по 10 записей",
    value: 10,
  },
  {
    label: "по 15 записей",
    value: 15,
  },
  {
    label: "по 20 записей",
    value: 20,
  },
]

const dropDownMenuOptions : MenuOption[] = [
  {
    label: "Продать со склада",
    key: "/sell",
    icon: renderIcon(CartOutline)
  },
  // {
  //   label: "История продаж",
  //   key: "/movement_history",
  //   icon: renderIcon(History20Regular)
  // },
]


const createDataTableColumns = (goToStock: (row: StockSaleStats, key: string) => void) : DataTableColumns<StockSaleStats> => {
  return [
    {
      title: '№',
      key: 'stock_id'
    },
    {
      title: 'Название',
      key: 'name'
    },
    {
      title: 'Адрес',
      key: 'address'
    },
    {
      title: 'Продажи за сегодня',
      key: 'today_sales',
      render: (row) => {
        return h(
          NTag,
          {
            type: row.today_sales ? 'success' : 'warning'
          },
          {
            default: () => {
              return h(
                NNumberAnimation,
                {
                  active: true,
                  from: 0,
                  to: row.today_sales || 0,
                  showSeparator: true,
                  duration: 1000
                }
              )
            }
          }
        )
      }
    },
    {
      title: 'Продажи за все время',
      key: 'total_sales',
      render: (row) => {
        return h(
          NTag,
          {
            type: row.total_sales ? 'success' : 'warning'
          },
          {
            default: () => {
              return h(
                NNumberAnimation,
                {
                  active: true,
                  from: 0,
                  to: row.total_sales || 0,
                  showSeparator: true,
                  duration: 1000
                }
              )
            }
          }
        )
      }
    },
    {
      key: 'actions',
      render: (row) => {
        return h(
            NDropdown,
            {
              options: dropDownMenuOptions,
              onSelect: (key: string) => goToStock(row, key)
            },
            { 
              default: () => h(
                NButton,
                {
                  renderIcon: renderIcon(ListOutline),
                  round: true
                }
              )
            },
        )
      }
    }
  ]
}

const goToStock = (row: StockSaleStats, key: string): void => {
  router.push(`${key}/${row.stock_id}`)
}

const loadData = async () : Promise<void> => {
  const response = await handleDataLoad({
    limit: paginationParams.value.pageSize,
    offset: paginationParams.value.page
  })
  
  if (response) {
    data.value = response.stock_list
    pageCount.value = response.page_count
    dataTableColumns.value = createDataTableColumns(goToStock)
  }
}

onBeforeMount(async () => await loadData())

</script>

<style scoped lang="scss">
</style>