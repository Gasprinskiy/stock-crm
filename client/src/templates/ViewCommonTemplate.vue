<template>
  <div class="view inner-content">
    <div class="app-h1 view-header">
      <n-icon>
        <props.icon/>
      </n-icon>
      {{ props.title }}
    </div>
    <slot/>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from "naive-ui";
import { Component } from "vue";

interface Props {
    title: String,
    icon: Component
}

const props = defineProps<Props>()

</script>

<style scoped lang="scss">
    .view-header {
        display: flex;
        align-items: center;

        .n-icon {
            margin-right: 5px;
        }
    }
</style>
