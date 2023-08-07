<template>
    <div class="connetion-error full-centered">
      <n-empty description="Что-то пошло не так">
        <template #icon>
          <n-icon>
            <EmojiSad24Regular/>
          </n-icon>
        </template>
        <template #extra>
          <p class="extra-title">
            Проблемы соеденения с сервером
          </p>
          <n-button @click="emitUpdate">
            Обновить
          </n-button>
        </template>
      </n-empty>
    </div>
</template>

<script setup lang="ts">
import { NEmpty, NButton, NIcon } from 'naive-ui';
import { EmojiSad24Regular } from "@vicons/fluent";

const emit = defineEmits(["update"])

const emitUpdate = () => emit('update')
</script>

<style scoped lang="scss">
  .connetion-error {
    .extra-title {
      color: var(--n-text-color);
      font-size: 14px;
      min-width: 250px;
      margin-bottom: 10px;
    }
  }
</style>