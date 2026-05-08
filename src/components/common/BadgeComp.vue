<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium select-none',
      colorClasses,
    ]"
  >
    <!-- label 우선 표시, 없으면 slot -->
    <span v-if="label">{{ label }}</span>
    <slot v-else />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'gray', // 색상 테마 (primary, success, warning, danger, info, gray)
  },
  outline: {
    type: Boolean,
    default: false, // 테두리 모드
  },

  label: {
    type: String,
    default: '', // 텍스트 레이블
  },
})

const colorClasses = computed(() => {
  const solid = {
    primary: 'bg-primary text-white dark:bg-primary/80',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100',
    danger: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    secondary: 'bg-violet-100 text-violet-800 dark:bg-violet-800 dark:text-violet-100',
    gray: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100',
  }

  const outline = {
    primary: 'text-primary border border-primary bg-transparent',
    success: 'text-emerald-700 border border-emerald-700 bg-transparent',
    warning: 'text-amber-700 border border-amber-700 bg-transparent',
    danger: 'text-red-700 border border-red-700 bg-transparent',
    info: 'text-blue-700 border border-blue-700 bg-transparent',
    secondary: 'text-violet-700 border border-violet-700 bg-transparent',
    gray: 'text-zinc-700 border border-zinc-500 bg-transparent',
  }

  return props.outline ? outline[props.color] : solid[props.color]
})
</script>
