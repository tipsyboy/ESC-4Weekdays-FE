<script setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import ModalComp from '@/components/common/ModalComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import { useVendorStore } from '@/stores/vendorStore'

// ✅ 전역에서 매입처 목록 가져오기
const { vendorList } = storeToRefs(useVendorStore())

const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['close', 'apply'])

// ✅ 검색 조건 데이터
const form = ref({
  vendors: [], // [{id, name}] 형태로 저장
  selectedVendorId: '', // 현재 선택 중인 매입처 id
  code: '',
  name: '',
  unit: '',
  minPrice: '',
  maxPrice: '',
  status: '',
  createdDate: '',
  updatedDate: '',
})

// ✅ v-model이 바뀔 때마다 선택된 매입처를 vendors 배열에 추가
watch(
    () => form.value.selectedVendorId,
    (id) => {
      if (!id) return
      const selected = vendorList.value.find(v => v.id === Number(id))
      if (selected && !form.value.vendors.some(v => v.id === selected.id)) {
        form.value.vendors.push(selected)
      }
      form.value.selectedVendorId = '' // 다시 선택 가능하도록 초기화
    }
)

// ✅ 매입처 제거
const removeVendor = (vendorId) => {
  form.value.vendors = form.value.vendors.filter(v => v.id !== vendorId)
}

// ✅ “적용” 버튼 클릭 시 부모로 조건 전달
const handleApply = () => {
  emit('apply', {
    ...form.value,
    vendors: form.value.vendors.map(v => v.id),
  })
  emit('close')
}

// ✅ 초기화 버튼 클릭 시
const handleReset = () => {
  form.value = {
    vendors: [],
    selectedVendorId: '',
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

// ✅ 중복된 vendor는 선택 목록에서 제외
const availableVendors = computed(() =>
    vendorList.value.filter(v => !form.value.vendors.some(sel => sel.id === v.id))
)
</script>

<template>
  <ModalComp
      :open="open"
      title="상품 상세 조건 검색"
      icon="tune"
      @close="emit('close')"
      size="max-w-5xl"
  >
    <form class="space-y-4">

      <!-- ✅ 0행: 매입처 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          매입처
        </label>

        <!-- v-model 기반 선택 -->
        <select v-model="form.selectedVendorId" class="input">
          <option value="" hidden>매입처 선택...</option> <!-- ✅ 문자열로 value -->
          <option
              v-for="vendor in availableVendors"
              :key="vendor.id"
              :value="vendor.id"
          >
            {{ vendor.name }}
          </option>
        </select>

        <!-- 선택된 매입처 태그 -->
        <div class="flex flex-wrap gap-2 mt-2">
          <span
              v-for="vendor in form.vendors"
              :key="vendor.id"
              class="flex items-center gap-1 bg-primary/10 text-primary text-sm font-medium px-2 py-1 rounded-full"
          >
            {{ vendor.name }}
            <button
                type="button"
                class="text-primary hover:text-red-500 font-bold"
                @click="removeVendor(vendor.id)"
            >
              ×
            </button>
          </span>
        </div>
      </div>

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
