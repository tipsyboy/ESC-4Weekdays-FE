<template>
  <aside
    class="flex flex-col border-r bg-white dark:bg-[#0f172a] border-gray-100 dark:border-gray-800 transition-[width,background-color,border-color] duration-200 ease-out"
    :class="isCollapsed ? 'w-20' : 'w-64'">
    <!-- 메뉴 -->
    <nav class="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
      <RouterLink v-for="menu in visibleMenus" :key="menu.route" :to="menu.route"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-150 ease-out group relative" :class="[
          isActive(menu.route)
            ? 'bg-primary/10 text-primary dark:bg-primary/20'
            : 'text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary',
          isCollapsed ? 'justify-center' : '',
        ]" :title="isCollapsed ? menu.label : ''">
        <span class="material-symbols-outlined text-[21px] transition-transform group-hover:scale-110" :class="[
          isActive(menu.route)
            ? 'text-primary'
            : 'text-gray-500 dark:text-gray-400 group-hover:text-primary',
        ]">
          {{ menu.icon }}
        </span>
        <span v-if="!isCollapsed" class="font-medium whitespace-nowrap">
          {{ menu.label }}
        </span>
      </RouterLink>

      <!-- 버튼들 -->
      <div class="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-2">
        <!-- 다크모드 -->
        <button
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-150 ease-out dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20"
          @click="handleToggleDarkMode" title="Toggle dark mode">
          <span class="material-symbols-outlined text-[22px] text-gray-700 dark:text-gray-300">
            {{ isDarkMode ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <!-- 사이드바 토글 -->
        <button @click="isCollapsed = !isCollapsed"
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-150 ease-out dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20"
          title="Toggle sidebar">
          <span class="material-symbols-outlined text-[22px] text-gray-700 dark:text-gray-300">
            {{ isCollapsed ? 'menu' : 'menu_open' }}
          </span>
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme.js'
import { useAuthStore } from '@/stores/authStore.js'

const route = useRoute()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const isCollapsed = ref(false)
const isDarkMode = computed(() => themeStore.isDarkMode)

const menus = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: ['ADMIN', 'MANAGER'] },
  { label: '직원 관리', icon: 'assignment_ind', route: '/members', roles: ['ADMIN'] },
  { label: '공급업체 관리', icon: 'storefront', route: '/vendors', roles: ['ADMIN', 'MANAGER', 'WORKER'] },
  { label: '상품 관리', icon: 'inventory_2', route: '/products', roles: ['ADMIN', 'MANAGER', 'WORKER'] },
  { label: '발주', icon: 'receipt_long', route: '/purchase-orders', roles: ['ADMIN', 'MANAGER', 'WORKER'] },
  { label: 'ASN', icon: 'local_shipping', route: '/asns', roles: ['ADMIN', 'MANAGER', 'WORKER'] },
  { label: '입고', icon: 'warehouse', route: '/inbounds', roles: ['ADMIN', 'MANAGER', 'WORKER'] },
  { label: '발주서', icon: 'receipt_long', route: '/vendor-portal/purchase-orders', roles: ['ADMIN', 'VENDOR_MANAGER'] },
  { label: '공급업체 ASN', icon: 'assignment_returned', route: '/vendor-portal/asns', roles: ['ADMIN', 'VENDOR_MANAGER'] },
]

const visibleMenus = computed(() => menus.filter((menu) => authStore.hasAnyRole(menu.roles)))

const isActive = (path) => {
  if (path === '/purchase-orders') {
    return route.path.startsWith('/purchase-orders')
  }

  if (path === '/asns') {
    return route.path.startsWith('/asns')
  }

  if (path === '/inbounds') {
    return route.path.startsWith('/inbounds')
  }

  if (path === '/vendor-portal/purchase-orders') {
    return route.path.startsWith('/vendor-portal/purchase-orders')
      || route.path.startsWith('/vendor-portal/purchase-requests')
  }

  if (path === '/vendor-portal/asns') {
    return route.path.startsWith('/vendor-portal/asns')
  }

  return route.path === path
}

const handleToggleDarkMode = () => {
  themeStore.toggleDarkMode()
}

// 반응형 자동 접힘
const handleResize = () => {
  isCollapsed.value = window.innerWidth < 1024
}

onMounted(() => {
  themeStore.initTheme()

  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
