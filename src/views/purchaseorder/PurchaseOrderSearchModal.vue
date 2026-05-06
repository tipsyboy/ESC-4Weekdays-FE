<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
    @click.self="closeModal"
  >
    <div class="flex max-h-[90vh] w-11/12 max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-800">
      <div class="flex items-center gap-3 border-b border-gray-200 px-6 py-5 dark:border-zinc-700">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <span class="material-symbols-outlined text-[22px]">receipt_long</span>
        </div>
        <h2 class="flex-1 text-xl font-semibold text-gray-900 dark:text-white">발주 상세 조건 검색</h2>
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
              <label for="vendorName" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                공급업체
              </label>
              <input
                id="vendorName"
                v-model.trim="searchParams.vendorName"
                type="text"
                placeholder="공급업체명을 입력하세요"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="requesterName" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                요청자
              </label>
              <input
                id="requesterName"
                v-model.trim="searchParams.requesterName"
                type="text"
                placeholder="요청자를 입력하세요"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="status" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                상태
              </label>
              <select
                id="status"
                v-model="searchParams.status"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                <option value="">전체</option>
                <option value="DRAFT">작성중</option>
                <option value="APPROVAL_PENDING">승인대기</option>
                <option value="APPROVED">승인완료</option>
                <option value="REJECTED">반려</option>
                <option value="CANCELED">취소</option>
                <option value="ORDERED">발주완료</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="expectedInboundDate" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                예정 입고일
              </label>
              <input
                id="expectedInboundDate"
                v-model="searchParams.expectedInboundDate"
                type="date"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="approverName" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                승인자
              </label>
              <input
                id="approverName"
                v-model.trim="searchParams.approverName"
                type="text"
                placeholder="승인자를 입력하세요"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="purchaseOrderNumber" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                발주서 번호
              </label>
              <input
                id="purchaseOrderNumber"
                v-model.trim="searchParams.purchaseOrderNumber"
                type="text"
                placeholder="예: PO-20260421-001"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="memoKeyword" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                메모 키워드
              </label>
              <input
                id="memoKeyword"
                v-model.trim="searchParams.memoKeyword"
                type="text"
                placeholder="요청 메모 키워드"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
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
          class="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
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
  isOpen: {
    type: Boolean,
    required: true,
  },
  initialParams: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'search'])

const createDefaultParams = () => ({
  vendorName: '',
  requesterName: '',
  status: '',
  expectedInboundDate: '',
  approverName: '',
  purchaseOrderNumber: '',
  memoKeyword: '',
})

const searchParams = reactive(createDefaultParams())

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) return
    Object.assign(searchParams, createDefaultParams(), props.initialParams || {})
  },
)

const closeModal = () => {
  emit('close')
}

const handleSearch = () => {
  emit('search', { ...searchParams })
  closeModal()
}

const resetForm = () => {
  Object.assign(searchParams, createDefaultParams())
}
</script>
