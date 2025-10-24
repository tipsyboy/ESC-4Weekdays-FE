<template>
  <header
      class="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 bg-white dark:bg-background-dark"
  >
    <!-- 왼쪽: 로고 + 네비게이션 -->
    <div class="flex items-center gap-6">
      <!-- 로고 -->
      <RouterLink to="/" class="flex items-center gap-2 text-zinc-900 dark:text-white">
        <span class="material-symbols-outlined text-primary text-2xl"> local_shipping </span>
        <span class="text-2xl font-bold">4Weekdays!</span>
      </RouterLink>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-4">
        <!--        v-if="!auth.isAuthenticated"-->
        <button
            @click="ui.openLoginModal"
            class="text-gray-700 dark:text-gray-200 hover:text-primary"
        >
          로그인
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import {useUIStore} from '@/stores/uiStore.js'

const ui = useUIStore()
</script>

<style scoped></style>
