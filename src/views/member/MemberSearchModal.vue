<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
    @click.self="closeModal"
  >
    <div class="flex max-h-[90vh] w-11/12 max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-800">
      <div class="flex items-center gap-3 border-b border-gray-200 px-6 py-5 dark:border-zinc-700">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white">
          <span class="material-symbols-outlined text-[22px]">manage_search</span>
        </div>
        <h2 class="flex-1 text-xl font-semibold text-gray-900 dark:text-white">직원 검색 조건</h2>
        <button
          type="button"
          class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
          @click="closeModal"
        >
          <span class="material-symbols-outlined text-gray-500">close</span>
        </button>
      </div>

      <div class="overflow-y-auto px-6 py-6">
        <form class="space-y-5" @submit.prevent="handleSearch">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="memberName" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">이름</label>
              <input
                id="memberName"
                v-model.trim="searchParams.name"
                type="text"
                placeholder="직원 이름을 입력하세요"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-sky-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="memberCode" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">사원번호</label>
              <input
                id="memberCode"
                v-model.trim="searchParams.memberCode"
                type="text"
                placeholder="예: MBR-001"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-sky-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="department" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">소속</label>
              <input
                id="department"
                v-model.trim="searchParams.department"
                type="text"
                placeholder="예: 구매팀"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-sky-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="loginId" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">로그인 ID</label>
              <input
                id="loginId"
                v-model.trim="searchParams.loginId"
                type="text"
                placeholder="사원번호 또는 이메일"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-sky-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="role" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">역할</label>
              <select
                id="role"
                v-model="searchParams.role"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-sky-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                <option value="">전체</option>
                <option value="ADMIN">관리자</option>
                <option value="MANAGER">운영 관리자</option>
                <option value="WORKER">실무 담당</option>
                <option value="VENDOR_MANAGER">외부 업체 담당</option>
              </select>
            </div>

            <div>
              <label for="status" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">상태</label>
              <select
                id="status"
                v-model="searchParams.status"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-sky-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                <option value="">전체</option>
                <option value="ACTIVE">재직</option>
                <option value="INACTIVE">휴직</option>
                <option value="LOCK">잠금</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      <div class="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
          @click="resetForm"
        >
          초기화
        </button>
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
          @click="closeModal"
        >
          닫기
        </button>
        <button
          type="button"
          class="rounded-lg bg-sky-600 px-5 py-2.5 font-medium text-white transition-colors shadow-sm hover:bg-sky-700"
          @click="handleSearch"
        >
          적용
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  initialParams: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close', 'search'])

const createDefaultParams = () => ({
  name: '',
  memberCode: '',
  department: '',
  loginId: '',
  role: '',
  status: '',
})

const searchParams = reactive(createDefaultParams())

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) return
    Object.assign(searchParams, createDefaultParams(), props.initialParams || {})
  },
)

const closeModal = () => emit('close')

const handleSearch = () => {
  emit('search', { ...searchParams })
  closeModal()
}

const resetForm = () => {
  Object.assign(searchParams, createDefaultParams())
}
</script>
