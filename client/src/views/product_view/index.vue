<template>
  <common-template
    :icon="Product"
    title="Товары"
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
  NTag, 
  NDropdown,
  NButton,
  NNumberAnimation
} from "naive-ui";
import { Product } from "@vicons/carbon";
import { ListOutline } from "@vicons/ionicons5";
import { History20Regular } from "@vicons/fluent";
import { inject, ref, onBeforeMount, h } from "vue";
import { StockApiWorkerInjectionKey } from "@/api_worker";
import { useApiRequestHandler } from "@/composables/api_request";
import type { Stock, StockProductStats } from "@/entity/stock/entity";
// import { useRouter } from "vue-router";
import { useRenderIcon } from '@/composables/render_icon';
import CommonTemplate from "@/templates/ViewCommonTemplate.vue";

const stocksApiWorker = inject(StockApiWorkerInjectionKey)!
const renderIcon = useRenderIcon()
// const router = useRouter()

const data = ref<Stock[] | null>(null)
const dataTableColumns = ref<DataTableColumns<StockProductStats> | null>(null)
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
    label: "Перейти к товарам",
    key: "/products",
    icon: renderIcon(Product)
  },
  {
    label: "История перемещений",
    key: "/movement_history",
    icon: renderIcon(History20Regular)
  },
]

const handleDataLoad = useApiRequestHandler(stocksApiWorker.findEmployeeProductStatStockList)
const createDataTableColumns = (goToStock: (row: StockProductStats, key: string) => void) : DataTableColumns<StockProductStats> => {
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
            default: () => {
              return h(
                NNumberAnimation,
                {
                  active: true,
                  from: 0,
                  to: row.product_count || 0,
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
      title: 'Товаров на приемке',
      key: 'movement_in_count',
      render: (row) => {
        return h(
          NTag,
          {
            type: row.movement_in_count ? 'warning' : 'success'
          },
          {
            default: () => {
              return h(
                NNumberAnimation,
                {
                  active: true,
                  from: 0,
                  to: row.movement_in_count || 0,
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

const goToStock = (row: StockProductStats, key: string): void => {
  console.log(row)
  console.log(key);
  
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
  .tabe-pagination {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
</style>
