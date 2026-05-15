<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6"
        @click.self="closeModal"
      >
        <div class="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-950">
          <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">Test Accounts</div>
                <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">테스트 계정 안내</h2>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">공통 비밀번호는 `1234` 입니다.</p>
              </div>
              <button
                type="button"
                class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                @click="closeModal"
              >
                <span class="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
          </div>

          <div class="px-6 py-5">
            <div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div class="grid grid-cols-[1fr_1.6fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                <div>Role</div>
                <div>Login ID</div>
              </div>
            <div
              v-for="account in accounts"
              :key="account.role"
              class="grid grid-cols-[1fr_1.6fr] gap-3 border-t border-slate-200 px-4 py-4 text-sm dark:border-slate-800"
            >
              <div class="font-semibold text-slate-900 dark:text-slate-100">{{ account.role }}</div>
              <div class="flex items-center justify-between gap-3">
                <div class="break-all text-slate-600 dark:text-slate-300">{{ account.loginId }}</div>
                <button
                  type="button"
                  class="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                  @click="copyToClipboard(account.loginId)"
                >
                  <span class="material-symbols-outlined text-[16px]">content_copy</span>
                  복사
                </button>
              </div>
            </div>
          </div>
        </div>

          <div class="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <div class="flex justify-end">
              <button
                type="button"
                class="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                @click="closeModal"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-2 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-2 opacity-0"
        >
          <div
            v-if="toastMessage"
            class="absolute left-1/2 top-12 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xl dark:bg-white dark:text-slate-950"
            role="status"
            aria-live="polite"
          >
            <span class="material-symbols-outlined text-[18px]">check_circle</span>
            {{ toastMessage }}
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const accounts = [
  { role: 'ADMIN', loginId: 'admin' },
]

const toastMessage = ref('')
let toastTimer = null

const closeModal = () => emit('close')

const showToast = (message) => {
  toastMessage.value = message
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
  toastTimer = window.setTimeout(() => {
    toastMessage.value = ''
    toastTimer = null
  }, 1800)
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast('로그인 ID가 복사되었습니다.')
  } catch {
    window.prompt('로그인 ID를 복사하세요.', text)
    showToast('복사할 로그인 ID를 표시했습니다.')
  }
}
</script>
