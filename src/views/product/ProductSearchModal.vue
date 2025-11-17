<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white dark:bg-zinc-800 rounded-xl w-11/12 max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

      <!-- Header -->
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <h2 class="flex-1 text-xl font-semibold text-gray-900 dark:text-white">상품 상세 조건 검색</h2>
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

          <!-- 공급 업체 -->
          <div>
            <label for="vendorName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              공급 업체
            </label>
            <input
              type="text"
              id="vendorName"
              v-model="searchParams.vendorName"
              placeholder="공급업체를 입력하세요"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
            />
          </div>

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
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
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
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <!-- 상태 -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              상태
            </label>
            <select
              id="status"
              v-model="searchParams.status"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
            >
              <option value="null">전체</option>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">품절</option>
              <option value="DISCONTINUED">단종</option>
            </select>
          </div>

          <!-- 최소 단가 / 최대 단가 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="minPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                최소 단가
              </label>
              <input
                type="number"
                id="minPrice"
                v-model.number="searchParams.minPrice"
                placeholder="0"
                min="0"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="maxPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                최대 단가
              </label>
              <input
                type="number"
                id="maxPrice"
                v-model.number="searchParams.maxPrice"
                placeholder="999999"
                min="0"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <!-- 등록일 범위 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="registeredFrom" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                등록일 (시작)
              </label>
              <input
                type="date"
                id="registeredFrom"
                v-model="searchParams.registeredFrom"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label for="registeredTo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                등록일 (종료)
              </label>
              <input
                type="date"
                id="registeredTo"
                v-model="searchParams.registeredTo"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-zinc-700 dark:text-white"
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
          class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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
  vendorName: '',
  productCode: '',
  productName: '',
  status: null,
  minPrice: null,
  maxPrice: null,
  registeredFrom: '',
  registeredTo: ''
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

// const handleSearch = () => {
//   // null/undefined/빈 문자열 제거
//   const cleanParams = Object.fromEntries(
//     Object.entries(searchParams.value).filter(([_, value]) => {
//       return value !== null && value !== undefined && value !== '';
//     })
//   );
//
//   emit('search', cleanParams);
//   closeModal();
// };

const handleSearch = () => {
  emit('search', { ...searchParams.value });
  closeModal();
};
const resetForm = () => {
  searchParams.value = {
    vendorName: '',
    productCode: '',
    productName: '',
    status: null,
    minPrice: null,
    maxPrice: null,
    registeredFrom: '',
    registeredTo: ''
  };
};
</script>