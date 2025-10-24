<template>
  <div class="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
    <AppHeader/>
    <!-- Main (Sidebar + Contents) -->
    <div class="flex flex-1 min-h-0">
      <AppSidebar/>
      <RouterView v-slot="{ Component, route }" class="flex-1 overflow-y-auto">
        <transition
            mode="out-in"
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-300"
            leave-to-class="opacity-0"
        >
          <!-- page fade 기능 구현 -->
          <component :is="Component" :key="route.fullPath"/>
        </transition>
      </RouterView>
    </div>
  </div>
  <AppFooter/>

  <!-- 로그인 모달창 -->
  <LoginModal v-if="ui.isLoginModalOpen"/>
</template>

<script setup>
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSideBar.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import {useUIStore} from '@/stores/uiStore.js'
import {useVendorStore} from "@/stores/vendorStore.js";
import {onMounted} from "vue";

const vendorStore = useVendorStore();

onMounted(() => {
  vendorStore.fetchVendors()
})

const ui = useUIStore()
</script>
