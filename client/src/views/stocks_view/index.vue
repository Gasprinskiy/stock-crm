<template>
  <div class="stocks-container inner-content">
    <div class="app-h1">
      Список складов
    </div>
    <div class="stocks-table">
      <n-data-table
        :data="stockList || []"
        :columns="stockListTableColumns || []"
      />
      <n-pagination
        v-if="hasMorePages"
        class="tabe-pagination"
        v-model:page="paginationParams.page"
        v-model:page-size="paginationParams.pageSize"
        @update-page="loadEmplStockList"
        @update-page-size="loadEmplStockList"
        :page-count="pageCount"
        :page-sizes="pageSizeOptions"
        show-size-picker
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NDataTable, DataTableColumns, NButton, NPagination, NTag } from "naive-ui";
import { inject, ref, onBeforeMount, h, computed } from "vue";
import { StockApiWorkerInjectionKey } from "@/api_worker";
import { useApiRequestHandler } from "@/composables/api_request";
import { Stock } from "@/entity/stock/entity";
// import { useRouter } from "vue-router";

const stocksApiWorker = inject(StockApiWorkerInjectionKey)!

// const router = useRouter()

const stockList = ref<Stock[] | null>(null)
const stockListTableColumns = ref<DataTableColumns<Stock> | null>(null)
const pageCount = ref<number>(0)
const paginationParams = ref({
  page: 1,
  pageSize: 10,
})

const pageSizeOptions = [
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

const hasMorePages = computed(() => pageCount.value > 1)

const handleLoadEmplStockList = useApiRequestHandler(stocksApiWorker.findEmployeeStockList)

const createStockListTableColumns = (goToStock: (row: Stock) => void) : DataTableColumns<Stock> => {
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
      title: 'Количество продуктов',
      key: 'product_count',
      render: (row) => {
        return h(
          NTag,
          {
            type: row.product_count ? 'success' : 'error'
          },
          {
            default: () => row.product_count || 0
          }
        )
      }
    },
    {
      key: 'actions',
      render: (row) => {
        return h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => goToStock(row),
            },
            { 
              default: () => 'Перейти' 
            },
        )
      }
    }
  ]
}

const goToStock = (row: Stock): void => {
  console.log(row)
}

const loadEmplStockList = async () : Promise<void> => {
  const response = await handleLoadEmplStockList({
    limit: paginationParams.value.pageSize,
    offset: paginationParams.value.page
  })
  
  if (response) {
    stockList.value = response.stock_list
    pageCount.value = response.page_count
    stockListTableColumns.value = createStockListTableColumns(goToStock)
  }
}

onBeforeMount(async () => await loadEmplStockList())

</script>

<style scoped lang="scss">
  .tabe-pagination {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
</style>
