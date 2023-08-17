<template>
  <common-template
    :icon="HomeOutline"
    title="Главная"
  >
    <div class="statistics-body">
      <n-card 
        class="statistics-half-space statistics-space"
        v-for="(item, index) in statisticsList"
        :key="index"
      >
        <n-statistic
          :label="item.label"
        >
          <template #prefix>
            <n-icon 
              class="statistics-icon"
              :component="item.icon"
            />
            <n-number-animation
              show-separator
              :from="0"
              :to="item.value"
              :active="stisticsLoaded"
              :duration="1000"
            />
          </template>
        </n-statistic>
      </n-card>
    </div>
  </common-template>
</template>

<script setup lang="ts">
import { NStatistic, NCard, NNumberAnimation, NIcon } from "naive-ui";
import { CashOutline, HomeOutline } from "@vicons/ionicons5";
import { Product } from "@vicons/carbon";
import { ReceiptMoney20Regular } from "@vicons/fluent"
import { computed, inject, onBeforeMount, ref } from "vue";
import { StatisticsApiWorkerInjectionKey } from "@/api_worker";
import { CommonStatistics, StatisticsView } from "@/entity/statistics/entity";
import { useApiRequestHandler } from "@/composables/api_request";
import CommonTemplate from "@/templates/ViewCommonTemplate.vue";

const statisticsApiWorker = inject(StatisticsApiWorkerInjectionKey)!

const commonStatistics = ref<CommonStatistics | null>(null)

const stisticsLoaded = computed((): boolean => commonStatistics.value !== null)
const statisticsList = computed((): StatisticsView[] => {
  return [
    {
      value: commonStatistics.value?.sales_sum,
      label: "Общая сумма продаж",
      icon: CashOutline
    },
    {
      value: commonStatistics.value?.sales_amount,
      label: "Продано товаров",
      icon: ReceiptMoney20Regular
    },
    {
      value: commonStatistics.value?.product_amount,
      label: "Количество товара на складах",
      icon: Product
    },
    {
      value: commonStatistics.value?.stock_amount,
      label: "Количество складов",
      icon: Product
    },
    {
      value: commonStatistics.value?.employee_count,
      label: "Количество работников",
      icon: Product
    },
  ]
})


const commonStatisticsLoad = useApiRequestHandler(statisticsApiWorker.loadCommonStatistics)
const loadCommonStatistics = async () : Promise<void> => {
  commonStatistics.value = await commonStatisticsLoad()
}

onBeforeMount(async () => await loadCommonStatistics())

</script>

<style scoped lang="scss">
  .statistics-body {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    .statistics-space {
      min-width: 215px;
      width: calc(33% - 5px);
      flex-grow: 1;
    }
    .statistics-icon {
      margin-right: 5px;
    }
  }
</style>
