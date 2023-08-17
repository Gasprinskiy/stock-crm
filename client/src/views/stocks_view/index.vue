<template>
  <common-template
    :icon="GridOutline"
    title="Список складов"
  >
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
  </common-template>
</template>

<script setup lang="ts">
import { 
  NDataTable, 
  type DataTableColumns,
  type PaginationSizeOption,
  type MenuOption,
  NPagination, 
  NTag, 
  NDropdown,
  NButton 
} from "naive-ui";
import { Product } from "@vicons/carbon";
import { ListOutline, GridOutline } from "@vicons/ionicons5";
import { History20Regular } from "@vicons/fluent";
import { inject, ref, onBeforeMount, h, computed } from "vue";
import { StockApiWorkerInjectionKey } from "@/api_worker";
import { useApiRequestHandler } from "@/composables/api_request";
import { Stock } from "@/entity/stock/entity";
// import { useRouter } from "vue-router";
import { useRenderIcon } from '@/composables/render_icon';
import CommonTemplate from "@/templates/ViewCommonTemplate.vue";

const stocksApiWorker = inject(StockApiWorkerInjectionKey)!
const renderIcon = useRenderIcon()
// const router = useRouter()

const stockList = ref<Stock[] | null>(null)
const stockListTableColumns = ref<DataTableColumns<Stock> | null>(null)
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
    label: "Товары",
    key: "/products",
    icon: renderIcon(Product)
  },
  {
    label: "История перемещений",
    key: "/movement_history",
    icon: renderIcon(History20Regular)
  },
]

const hasMorePages = computed(() => pageCount.value > 1)

const handleLoadEmplStockList = useApiRequestHandler(stocksApiWorker.findEmployeeStockList)
const createStockListTableColumns = (goToStock: (row: Stock, key: string) => void) : DataTableColumns<Stock> => {
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
      title: 'Количество товара',
      key: 'product_count',
      render: (row) => {
        return h(
          NTag,
          {
            type: row.product_count ? 'success' : 'warning'
          },
          {
            default: () => row.product_count || 0
          }
        )
      }
    },
    {
      title: 'Товаров на приемке',
      key: 'movement_in_count',
      render: (row) => {
        return h(
          NTag,
          {
            type: row.movement_in_count ? 'warning' : 'success'
          },
          {
            default: () => row.movement_in_count || 0
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

const goToStock = (row: Stock, key: string): void => {
  console.log(row)
  console.log(key);
  
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
