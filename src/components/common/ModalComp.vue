<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  open: Boolean,
  title: String,
  icon: String, // Material Symbols 아이콘 이름 (선택)
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: 'max-w-md',
  },
})
const emit = defineEmits(['close'])

// 오버레이 클릭으로 닫기
function handleOverlayClick(e) {
  if (props.closeOnOverlay && e.target === e.currentTarget) {
    emit('close')
  }
}

// ESC 키로 닫기
function handleEsc(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', handleEsc))
onUnmounted(() => document.removeEventListener('keydown', handleEsc))
</script>

<template>
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      @click="handleOverlayClick"
    >
      <!-- 모달 본문 -->
      <div
        :class="[
          'relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 rounded-2xl shadow-2xl w-full',
          size, // ✅ 이제 문자열로 받아서 Tailwind 클래스 적용됨
        ]"
        @click.stop
      >
        <!-- 닫기 버튼 -->
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          &times;
        </button>

        <!-- 헤더 -->
        <div v-if="title || icon" class="text-center mb-6 mt-2">
          <div
            v-if="icon"
            class="inline-flex items-center justify-center bg-primary text-white rounded-full size-12 mb-3"
          >
            <span class="material-symbols-outlined text-3xl">{{ icon }}</span>
          </div>
          <h2 v-if="title" class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h2>
        </div>

        <!-- 기본 슬롯 -->
        <div>
          <slot />
        </div>

        <!-- footer 슬롯 -->
        <div v-if="$slots.footer" class="mt-6">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>
