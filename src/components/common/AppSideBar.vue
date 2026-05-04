<template>
  <aside
    class="flex flex-col border-r transition-all duration-300 bg-white dark:bg-[#0f172a] border-gray-100 dark:border-gray-800"
    :class="isCollapsed ? 'w-20' : 'w-64'">
    <!-- 메뉴 -->
    <nav class="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
      <RouterLink v-for="menu in munus" :key="menu.label" :to="menu.route"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative" :class="[
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
          class="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
          @click="handleToggleDarkMode" title="Toggle dark mode">
          <span class="material-symbols-outlined text-[22px] text-gray-700 dark:text-gray-300">
            {{ isDarkMode ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <!-- 사이드바 토글 -->
        <button @click="isCollapsed = !isCollapsed"
          class="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme.js'

const route = useRoute()
const themeStore = useThemeStore()
const isCollapsed = ref(false)

const munus = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: '직원 관리', icon: 'assignment_ind', route: '/members' },
]

const isActive = (path) => route.path === path

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
