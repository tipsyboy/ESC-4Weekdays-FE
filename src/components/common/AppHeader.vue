<template>
  <header
    class="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 bg-white dark:bg-background-dark">
    <!-- 왼쪽: 로고 + 네비게이션 -->
    <div class="flex items-center gap-6">
      <!-- 로고 -->
      <RouterLink to="/" class="flex items-center gap-2 text-zinc-900 dark:text-white">
        <span class="material-symbols-outlined text-primary text-2xl"> local_shipping </span>
        <span class="text-2xl font-bold">green</span>
      </RouterLink>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-4">
        <button v-if="!auth.isAuthenticated" @click="ui.openLoginModal"
          class="text-gray-700 dark:text-gray-200 hover:text-primary">
          로그인
        </button>
        <button v-else @click="auth.logout" class="text-gray-700 dark:text-gray-200 hover:text-primary">
          로그아웃
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUIStore } from '@/stores/uiStore.js'
import { useAuthStore } from '@/stores/authStore.js'

const ui = useUIStore()
const auth = useAuthStore()
</script>

<style scoped></style>
