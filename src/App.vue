<template>
  <div class="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
    <!-- 헤더 -->
    <AppHeader v-if="!isLoginPage" />

    <div class="flex flex-1 min-h-0">
      <AppSidebar v-if="!isLoginPage" />

      <RouterView v-slot="{ Component, route }" class="flex-1 overflow-y-auto">
        <transition mode="out-in" enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-200" leave-to-class="opacity-0">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </RouterView>
    </div>
  </div>

  <!-- 푸터 -->
  <AppFooter v-if="!isLoginPage" />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSideBar.vue'
import AppFooter from '@/components/common/AppFooter.vue'

import { useVendorStore } from '@/stores/vendorStore.js'

const vendorStore = useVendorStore()
const route = useRoute()

onMounted(() => {
  vendorStore.fetchVendors()
})

// 로그인 페이지에서는 전역 레이아웃 숨김
const isLoginPage = computed(() => route.path === '/auth/login')
</script>
