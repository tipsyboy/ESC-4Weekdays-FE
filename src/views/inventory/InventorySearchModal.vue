<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white dark:bg-zinc-800 rounded-xl w-11/12 max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

      <!-- Header -->
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
        <div class="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2 class="flex-1 text-xl font-semibold text-gray-900 dark:text-white">재고 상세 조건 검색</h2>
        <button
          @click="closeModal"
          class="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-6 overflow-y-auto">
        <form @submit.prevent="handleSearch" class="space-y-5">

          <!-- 상품 코드 / 상품 이름 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="productCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                상품 코드
              </label>
              <input
                type="text"
                id="productCode"
                v-model="searchParams.productCode"
                placeholder="예: PRD-12345"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="productName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                상품 이름
              </label>
              <input
                type="text"
                id="productName"
                v-model="searchParams.productName"
                placeholder="상품명을 입력하세요"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <!-- 보관 위치 / LOT 번호 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="locationCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                보관 위치
              </label>
              <input
                type="text"
                id="locationCode"
                v-model="searchParams.locationCode"
                placeholder="예: 20-J"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="lotNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LOT 번호
              </label>
              <input
                type="text"
                id="lotNumber"
                v-model="searchParams.lotNumber"
                placeholder="예: LOT-19820417-403"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <!-- 입고 코드 -->
          <div>
            <label for="inboundCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              입고 코드
            </label>
            <input
              type="text"
              id="inboundCode"
              v-model="searchParams.inboundCode"
              placeholder="예: IN-20251117-001"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
            />
          </div>

          <!-- 입고일 범위 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="inboundDateFrom" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                입고일 (시작)
              </label>
              <input
                type="date"
                id="inboundDateFrom"
                v-model="searchParams.inboundDateFrom"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="inboundDateTo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                입고일 (종료)
              </label>
              <input
                type="date"
                id="inboundDateTo"
                v-model="searchParams.inboundDateTo"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

        </form>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 rounded-b-xl">
        <button
          type="button"
          @click="resetForm"
          class="px-5 py-2.5 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-600 transition-colors"
        >
          초기화
        </button>
        <button
          type="button"
          @click="closeModal"
          class="px-5 py-2.5 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-600 transition-colors"
        >
          닫기
        </button>
        <button
          type="submit"
          @click="handleSearch"
          class="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          적용
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  initialParams: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'search']);

const searchParams = ref({
  productCode: '',
  productName: '',
  locationCode: '',
  lotNumber: '',
  inboundCode: '',
  inboundDateFrom: '',
  inboundDateTo: ''
});

// 모달 열릴 때 초기값 설정
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.initialParams) {
    searchParams.value = { ...searchParams.value, ...props.initialParams };
  }
});

const closeModal = () => {
  emit('close');
};

const handleSearch = () => {
  emit('search', { ...searchParams.value });
  closeModal();
};

const resetForm = () => {
  searchParams.value = {
    productCode: '',
    productName: '',
    locationCode: '',
    lotNumber: '',
    inboundCode: '',
    inboundDateFrom: '',
    inboundDateTo: ''
  };
};
</script>