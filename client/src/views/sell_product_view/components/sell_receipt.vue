<template>
  <div class="sell-receipt">
    <div class="sell-receipt-inner">
      <n-form
        class="search-form"
        @submit.prevent="findProductList"
      >
        <n-form-item>
          <n-input
            placeholder="поиск товара"
            v-model:value="productQuery"
            type="text"
          />
        </n-form-item>
        <n-form-item>
          <n-button
            type="primary"
            attr-type="submit"
            round
            >
            <template #icon>
              <n-icon>
                <SearchOutline/>
              </n-icon>
            </template>
          </n-button>
          <n-button
            type="warning"
            attr-type="reset"
            round
            @click="resetSearch"
            >
            <template #icon>
              <n-icon>
                <RefreshOutline/>
              </n-icon>
            </template>
          </n-button>
        </n-form-item>
      </n-form>
      <n-data-table
        :data="data"
        :columns="dataTableColumns"
        :max-height="tableMaxHeight"
      />
      <n-pagination
        class="tabel-pagination"
        v-model:page="paginationParams.page"
        v-model:page-size="paginationParams.pageSize"
        @update-page="findProductList"
        @update-page-size="findProductList"
        :page-count="pageCount"
        :page-sizes="pageSizeOptions"
        show-size-picker
      />
    </div>
    <n-divider
      style="height: 100%;"
      vertical
    />
    <div class="sell-receipt-inner">
      <n-form
        class="cart-form"
      >
        <n-form-item
          label="Общая сумма"
        >
          <n-tag
            type="info"
          >
            <n-number-animation
              show-separator
              :from="0"
              :to="cartTotalSum"
              :duration="1000"
            />
          </n-tag>
        </n-form-item>
        <n-form-item
          label="Тип оплаты"
        >
          <n-select
            v-model:value="paymentTypeID"
            :options="paymentTypes"
            label-field="name"
            value-field="p_type_id"
            :disabled="!cartHasItems"
            placeholder="выберите тип оплаты"
          />
        </n-form-item>
        <n-form-item
          class="close-check"
        >
          <n-button
            type="primary"
            attr-type="submit"
            :disabled="!cartHasItems"
            round
          >
            <template #icon>
              <n-icon>
                <CashOutline/>
              </n-icon>
            </template>
          </n-button>
          <n-button
            @click="warnResetCart"
            type="warning"
            attr-type="reset"
            :disabled="!cartHasItems"
            round
          >
            <template #icon>
              <n-icon>
                <RefreshOutline/>
              </n-icon>
            </template>
          </n-button>
        </n-form-item>
      </n-form>
      <n-data-table
        :data="cart"
        :columns="cartTableColumns"
        :max-height="tableMaxHeight"
      />
    </div>
  </div>
  <n-modal
    v-model:show="showModal"
    @update:show="resetModalValues"
  >
    <n-card
      style="max-width: 400px;"
      :title="chosenProductName"
    >
      <template #header-extra>
        <n-button
          v-if="moreThanOneFormItem"
          @click="removeVariation"
        >
          <template #icon>
            <n-icon>
              <RemoveOutline/>
            </n-icon>
          </template>
        </n-button>
        <n-button
          v-if="moreThenOneVariation"
          @click="addVariation"
        >
          <template #icon>
            <n-icon>
              <AddOutline/>
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-form
        @submit.prevent="addToCart"
      >
        <div
          v-for="(item, index) in addToCardFormItems"
          :key="index"
        >
          <n-form-item
            label="Выберите вариацию"
          >
            <n-select
              :options="chosenProductVariationList"
              placeholder="вариация"
              v-model:value="item.variationID"
              @update:value="selectVariation(index)"
              :status="fieldInvalid(index, 'variationID')"
            />
          </n-form-item>
          <n-form-item
            label="Введите количество"
          >
            <n-input-number
              style="width: 100%;"
              v-model:value="item.variationAmount"
              :placeholder="variationAmountPlaceholder(item.variation)"
              :max="variationAmount(item.variation)"
              :status="fieldInvalid(index, 'variationAmount')"
            />
          </n-form-item>
        </div>
        <n-form-item
          class="add-to-card-button"
        >
          <n-button
            type="primary"
            attr-type="submit"
          >
            Добавить в корзину
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { 
  type DataTableColumns,
  type PaginationSizeOption,
  type PaginationProps,
  NDataTable,
  NPagination,
  NForm, 
  NDivider, 
  NInput,
  NInputNumber,
  NSelect, 
  NFormItem, 
  NButton, 
  NIcon,
  NModal,
  NCard,
  NNumberAnimation,
  NTag,
  useDialog
} from "naive-ui";
import { SearchOutline, AddOutline, RemoveOutline, CashOutline, RefreshOutline } from "@vicons/ionicons5"
import type { SaleProductData, PaymentType, SaleProduct } from "@/entity/sales/entity/"
import type { Product, ProductVariation, ProductVariationSelectItem } from "@/entity/product/entity/"
import type { FindProductListParam, FindProductVariatonParam } from "@/entity/product/params/"
import { ProductApiWorkerInjectionKey, SalesApiWorkerInjectionKey } from "@/api_worker/"
import { CartStorageInjectionKey } from "@/storage_worker/";
import { inject, ref, onBeforeMount, h, computed, toRaw } from "vue";
import { useApiRequestHandler } from "@/composables/api_request";
import { useVuelidate, type Validation, type ValidationRuleWithoutParams, type ValidationRuleWithParams } from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'

///////// types
interface ValidationRules {
  variationID: { required: ValidationRuleWithoutParams<any> }; 
  variationAmount: { required: ValidationRuleWithoutParams<any>, minValue: ValidationRuleWithParams<{min: number}>};
}
/////////

///////// static data
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
const tableMaxHeight = 424
/////////

///////// props
const props = defineProps({
  receiptId: Number,
  stockId: Number
})

//////// storage worker
const cartStorage = inject(CartStorageInjectionKey)!
////////

///////// api handlers
const productApiWorker = inject(ProductApiWorkerInjectionKey)!
const salesApiWorker = inject(SalesApiWorkerInjectionKey)!
/////////

///////// use 
const dialog = useDialog()
const handleDataLoad = useApiRequestHandler(productApiWorker.findSalesProductList)
const handleProductVariationLoad = useApiRequestHandler(productApiWorker.findProductVariationByStockID)
const handleLoadPaymentTypes = useApiRequestHandler(salesApiWorker.loadPaymentTypes)
/////////

///////// refs
const data = ref<Product[]>([])
const dataTableColumns = ref<DataTableColumns<Product>>([])
const pageCount = ref<number>(0)
const productQuery = ref<string | null>(null)
const paginationParams = ref<PaginationProps>({
  page: 1,
  pageSize: 10,
})
const showModal = ref<boolean>(false)
const chosenProduct = ref<Product | null>(null)
const chosenProductVariationList = ref<ProductVariationSelectItem[]>([])
const addToCardFormItems = ref<{
  variation: ProductVariation | null;
  variationID: number | null;
  variationAmount: number | null
}[]>([
  {
    variation: null,
    variationID: null,
    variationAmount: null
  }
])
const cart = ref<SaleProductData[]>([])
const cartTableColumns = ref<DataTableColumns<SaleProductData>>([])
const paymentTypes = ref<PaymentType[]>([])
const paymentTypeID = ref<number | null>(null)
/////////

///////// computed
const chosenProductName = computed(() : string | undefined => chosenProduct.value?.product_name)
const moreThenOneVariation = computed(() : boolean => chosenProductVariationList.value.length > addToCardFormItems.value.length)
const moreThanOneFormItem = computed(() : boolean => addToCardFormItems.value.length > 1)
const addToCardFormRules = computed(() : ValidationRules[] => {
  const rules : ValidationRules[] = []
  addToCardFormItems.value.forEach(() => {
    rules.push({
      variationID: { required },
      variationAmount: { 
        required,
        minValue: minValue(1), 
      }
    })
  })

  return rules
})
const fieldInvalid = computed(() : (index: number, key: keyof Validation) => any => {
  return (index: number, key: keyof Validation) => ($v.value[index][key].$invalid && $v.value[index][key].$dirty) ? "error" : undefined
})
const cartHasItems = computed(() : boolean => cart.value.length > 0)
const cartTotalSum = computed(() : number => cart.value.reduce((acc, cur) => acc + cur.summed_price, 0))
/////////

///////// validation
const $v = useVuelidate(addToCardFormRules, addToCardFormItems)
/////////

///////// methods
const variationChosen = (row: ProductVariation | null) : boolean => {
  return row !== null
}

const variationAmountPlaceholder = (row: ProductVariation | null) : string => {
  return variationChosen(row) ? `Не более: ${variationAmount(row)} шт` : 'количество'
}

const variationAmount = (row: ProductVariation | null) : number => {
  return row?.amount || 0
}

const createDataTableColumns = (findProductVariation: (row: Product) => void) : DataTableColumns<Product> => {
  return [
    {
      title: 'ID',
      key: 'product_id'
    },
    {
      title: 'Название',
      key: 'product_name'
    },
    {
      key: 'action',
      render: (row) => {
        return h(
          NButton,
          {
            onClick: async () => await findProductVariation(row)
          },
          {
            default: () => "Добавить"
          }
        )
      }
    }
  ]
}

const createCartTableColumns = (removeFromCart: (row: SaleProductData) => void) : DataTableColumns<SaleProductData> => {
  return [
    {
      title: 'Название',
      key: 'product_name'
    },
    {
      title: 'Цена за единицу',
      key: 'price'
    },
    {
      title: 'Общая цена',
      key: 'summed_price'
    },
    {
      title: 'Количество',
      key: 'amount'
    },
    {
      key: 'action',
      render: (row) => {
        return h(
          NButton,
          {
            onClick: async () => await removeFromCart(row)
          },
          {
            default: () => "Удалить"
          }
        )
      }
    }
  ]
}

const findProductVariation = async (row: Product) : Promise<void> => {
  const payload : FindProductVariatonParam = {
    product_id: row.product_id,
    stock_id: props.stockId
  }

  const response = await handleProductVariationLoad(payload)

  if (response) {
    chosenProduct.value = row
    response.forEach(item => {
      chosenProductVariationList.value.push({
        label: `${item.variation_name} (${item.amount} шт)`,
        value: item.variation_id,
        disabled: false,
        price: item.price,
        amount: item.amount,
        variation_name: item.variation_name,
        variation_id: item.variation_id
      })
    })

    showModal.value = true
  }
}

const findProductList = async () : Promise<void> => {
  const payload : FindProductListParam = {
    limit: paginationParams.value.pageSize,
    offset: paginationParams.value.page,
    stock_id: props.stockId,
    query: productQuery.value
  }

  const response = await handleDataLoad(payload)
  data.value = response?.product_list || []
  pageCount.value = response?.page_count || 0
  dataTableColumns.value = createDataTableColumns(findProductVariation)
}

const loadPaymentTypes = async () : Promise<void> => {
  const response = await handleLoadPaymentTypes()  
  paymentTypes.value = response || []
  cartTableColumns.value = createCartTableColumns(removeFromCart) 
}

const selectVariation = (index: number) : void => {
  const variationIndex = chosenProductVariationList.value.findIndex(item => item.variation_id === addToCardFormItems.value[index].variationID)
  if (variationIndex >= 0) {
    addToCardFormItems.value[index].variation = {
      variation_id: chosenProductVariationList.value[variationIndex].variation_id,
      variation_name: chosenProductVariationList.value[variationIndex].variation_name,
      price: chosenProductVariationList.value[variationIndex].price,
      amount: chosenProductVariationList.value[variationIndex].amount,
    }

    chosenProductVariationList.value[variationIndex].disabled = true
  }
}

const addVariation = () : void => {
  addToCardFormItems.value.push({
    variation: null,
    variationID: null,
    variationAmount: null
  })
}

const removeVariation = (): void => {
  addToCardFormItems.value.pop()
}

const removeFromCart = async (row: SaleProductData) : Promise<void> => {
  cart.value = cart.value.filter(item => item.product_id !== row.product_id)

  const payload = toRaw(cart.value).map(item => toRaw(item))
  await cartStorage.saveReceipt(props.receiptId!, props.stockId!, payload)
}

const resetModalValues = () : void => {
  addToCardFormItems.value = [
    {
      variation: null,
      variationID: null,
      variationAmount: null
    }
  ]
  chosenProductVariationList.value = []
  $v.value.$reset()
}

const resetSearch = async () : Promise<void> => {
  productQuery.value = null
  await findProductList()
}

const warnResetCart = () : void => {
  dialog.warning({
    title: "Очистить корзину?",
    positiveText: "Да",
    onPositiveClick: () => resetCart()
  })
}

const resetCart = async () : Promise<void> => {
  cart.value = []
  await cartStorage.saveReceipt(props.receiptId!, props.stockId!, null)
}

const addToCart = async () : Promise<void> => {  
  $v.value.$validate()
  if (!$v.value.$invalid) {
    addToCardFormItems.value.forEach(item => {
      if (item.variation && chosenProduct.value) {
        const hasIndex = cart.value.findIndex(row => row.variation_id === item.variationID)

        if (hasIndex >= 0) {
          cart.value[hasIndex].amount += item.variationAmount!
          cart.value[hasIndex].summed_price = cart.value[hasIndex].price * cart.value[hasIndex].amount
          return
        }

        cart.value.unshift({
          product_name: `${chosenProduct.value.product_name} (${item.variation.variation_name})`,
          product_id: chosenProduct.value.product_id,
          variation_id: item.variation.variation_id,
          amount: item.variationAmount!,
          stock_id: props.stockId!,
          price: item.variation.price,
          summed_price: item.variation.price * item.variationAmount!
        })
      }
    })
    showModal.value = false
    resetModalValues()

    const payload = toRaw(cart.value).map(item => toRaw(item))
    await cartStorage.saveReceipt(props.receiptId!, props.stockId!, payload)
  }
}

const findReceiptCart = async () : Promise<void> => {
  const receiptCart = await cartStorage.getReceiptCartById(props.receiptId!, props.stockId!)
  cart.value = receiptCart || []
}

/////////

///////// hooks
onBeforeMount(async () => {    
  await findReceiptCart()
  await findProductList()
  await loadPaymentTypes()
})
/////////
</script>

<style scoped lang="scss">
  .sell-receipt {
    width: 100%;
    height: 100%;
    display: flex;
    .sell-receipt-inner {
      width: 50%;
      height: 100%;
      padding: 5px;

      .n-button {
        margin: 0px 1px;
      }

      .search-form {
        display: grid;
        width: 100%;
        grid-template-columns: calc(84%) 16%;
        gap: 5px;
      }

      .cart-form {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(3, 33%);

        .close-check {
          display: flex;
          justify-content: flex-end;

        }
      }
    }
    .separator {
      height: 100%;
    }
  }

  .add-to-card-button {
    display: flex;
    justify-content: flex-end;
  }
</style>