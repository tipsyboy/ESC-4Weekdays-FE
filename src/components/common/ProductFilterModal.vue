<script setup>
import { ref } from 'vue'
import ModalComp from '@/components/common/ModalComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'

const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['close', 'apply'])

// 검색 조건 데이터
const form = ref({
  code: '',
  name: '',
  unit: '',
  minPrice: '',
  maxPrice: '',
  status: '',
  createdDate: '',
  updatedDate: '',
})

// “적용” 버튼 클릭 시 부모로 조건 전달
const handleApply = () => {
  emit('apply', { ...form.value })
  emit('close')
}

// 초기화 버튼 클릭 시
const handleReset = () => {
  form.value = {
    code: '',
    name: '',
    unit: '',
    minPrice: '',
    maxPrice: '',
    status: '',
    createdDate: '',
    updatedDate: '',
  }
}
</script>

<template>
  <ModalComp
      :open="open"
      title="상품 상세 조건 검색"
      icon="tune"
      @close="emit('close')"
  >
    <form class="space-y-4">
      <!-- 1행: 상품 코드 / 상품 이름 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            상품 코드
          </label>
          <input
              v-model="form.code"
              type="text"
              placeholder="상품 코드를 입력하세요"
              class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            상품 이름
          </label>
          <input
              v-model="form.name"
              type="text"
              placeholder="상품명을 입력하세요"
              class="input"
          />
        </div>
      </div>

      <!-- 2행: 단위 / 상태 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            단위
          </label>
          <input v-model="form.unit" type="text" placeholder="예: 10" class="input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            상태
          </label>
          <select v-model="form.status" class="input">
            <option value="">전체</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DISCONTINUED">DISCONTINUED</option>
          </select>
        </div>
      </div>

      <!-- 3행: 단가 범위 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            최소 단가
          </label>
          <input v-model.number="form.minPrice" type="number" min="0" placeholder="0" class="input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            최대 단가
          </label>
          <input v-model.number="form.maxPrice" type="number" min="0" placeholder="999999" class="input" />
        </div>
      </div>

      <!-- 4행: 등록일 / 수정일 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            등록일
          </label>
          <input v-model="form.createdDate" type="date" class="input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            수정일
          </label>
          <input v-model="form.updatedDate" type="date" class="input" />
        </div>
      </div>
    </form>

    <!-- footer -->
    <template #footer>
      <div class="flex justify-end gap-3">
        <ButtonComp color="secondary" @click="handleReset">초기화</ButtonComp>
        <ButtonComp color="secondary" @click="emit('close')">닫기</ButtonComp>
        <ButtonComp color="primary" @click="handleApply">적용</ButtonComp>
      </div>
    </template>
  </ModalComp>
</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary;
}
</style>
