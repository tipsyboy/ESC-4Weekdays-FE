<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
    @click.self="closeModal"
  >
    <div class="flex w-11/12 max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-800">
      <div class="flex items-center gap-3 border-b border-gray-200 px-6 py-5 dark:border-zinc-700">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <span class="material-symbols-outlined text-[22px]">filter_alt</span>
        </div>
        <h2 class="flex-1 text-xl font-semibold text-gray-900 dark:text-white">상품 상세 조건 검색</h2>
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
          <div>
            <label for="productName" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              상품명
            </label>
            <input
              id="productName"
              v-model.trim="searchParams.productName"
              type="text"
              placeholder="상품명을 입력하세요"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="productCode" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                상품 코드
              </label>
              <input
                id="productCode"
                v-model.trim="searchParams.productCode"
                type="text"
                placeholder="예: P-20260421-001"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="category" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                카테고리
              </label>
              <input
                id="category"
                v-model.trim="searchParams.category"
                type="text"
                placeholder="예: 포장재"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
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
                <option value="SELLING">판매중</option>
                <option value="PAUSED">일시중지</option>
                <option value="DISCONTINUED">단종</option>
              </select>
            </div>
          </div>

          <div>
            <label for="vendorName" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              공급업체
            </label>
            <input
              id="vendorName"
              v-model.trim="searchParams.vendorName"
              type="text"
              placeholder="공급업체를 입력하세요"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            />
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
          class="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition-colors shadow-sm hover:bg-emerald-700"
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
  productCode: '',
  productName: '',
  category: '',
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
