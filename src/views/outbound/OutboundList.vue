<template>
  <AppPageLayout>
    <!-- Header -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">출고 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            출고 내역을 조회하고 관리합니다.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- 신규 출고 버튼 -->
          <RouterLink to="/outbound/create" class="w-40 whitespace-nowrap">
            <ButtonComp color="primary" icon="add">신규 출고</ButtonComp>
          </RouterLink>

          <SearchBarComp v-model="filters.search" placeholder="출고 내역 검색..." />
        </div>
      </div>
    </template>

    <!-- 필터 버튼 영역 -->
    <div class="flex flex-wrap items-center gap-3 mb-8">
      <!-- 출고 유형 -->
      <div class="relative">
        <button
          @click="toggleDropdown('type')"
          class="flex items-center gap-2 rounded border border-zinc-300 dark:border-zinc-700
                 bg-background-light dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300
                 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          출고 유형
          <span class="material-symbols-outlined text-base">expand_more</span>
        </button>
        <div
          v-if="activeDropdown === 'type'"
          class="absolute mt-1 w-40 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg z-20"
        >
          <button
            v-for="option in typeOptions"
            :key="option.value"
            class="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
            @click="selectType(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- 출고 상태 -->
      <div class="relative">
        <button
          @click="toggleDropdown('status')"
          class="flex items-center gap-2 rounded border border-zinc-300 dark:border-zinc-700
                 bg-background-light dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300
                 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          출고 상태
          <span class="material-symbols-outlined text-base">expand_more</span>
        </button>
        <div
          v-if="activeDropdown === 'status'"
          class="absolute mt-1 w-40 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg z-20"
        >
          <button
            v-for="option in statusOptions"
            :key="option.value"
            class="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
            @click="selectStatus(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 출고 목록 테이블 -->
    <TableComp :columns="columns" :data="filteredList">
      <!-- 출고 번호 -->
      <template #cell-outboundCode="{ row }">
        <RouterLink
          :to="`/outbound/${row.id}`"
          class="text-blue-600 hover:underline font-medium"
        >
          {{ row.outboundCode }}
        </RouterLink>
      </template>

      <!-- 상태 -->
      <template #cell-status="{ row }">
        <BadgeComp :label="getStatusLabel(row.status)" :type="getStatusColor(row.status)" />
      </template>
    </TableComp>
  </AppPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getStatusLabel, getStatusColor } from '@/utils/statusMapper.js'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import TableComp from '@/components/common/TableComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'

const filters = ref({
  type: '',
  status: '',
  search: '',
})

// dropdown 제어
const activeDropdown = ref(null)
const toggleDropdown = (menu) => {
  activeDropdown.value = activeDropdown.value === menu ? null : menu
}

// 옵션 목록
const typeOptions = [
  { label: '전체', value: '' },
  { label: '판매', value: 'SALE' },
  { label: '반품', value: 'RETURN' },
  { label: '이동', value: 'TRANSFER' },
]

const statusOptions = [
  { label: '전체', value: '' },
  { label: '대기', value: 'PENDING' },
  { label: '진행 중', value: 'IN_PROGRESS' },
  { label: '완료', value: 'COMPLETED' },
  { label: '취소', value: 'CANCELED' },
]

// 선택 이벤트
const selectType = (value) => {
  filters.value.type = value
  activeDropdown.value = null
}
const selectStatus = (value) => {
  filters.value.status = value
  activeDropdown.value = null
}

// 테이블 컬럼
const columns = [
  { key: 'outboundCode', label: '출고 번호' },
  { key: 'partnerName', label: '거래처' },
  { key: 'productName', label: '상품명' },
  { key: 'quantity', label: '수량', align: 'right' },
  { key: 'type', label: '유형' },
  { key: 'status', label: '상태' },
  { key: 'handler', label: '담당자' },
  { key: 'outboundDate', label: '출고일' },
]

// 목업 데이터
const outboundList = ref([
  {
    id: 1,
    outboundCode: 'OB-20250101',
    partnerName: '거래처 A',
    productName: '제주 감귤 5kg',
    quantity: 10,
    type: 'SALE',
    status: 'PENDING',
    handler: '김하늘',
    outboundDate: '2025-01-10',
  },
  {
    id: 2,
    outboundCode: 'OB-20250102',
    partnerName: '거래처 B',
    productName: '청포도 3kg',
    quantity: 5,
    type: 'TRANSFER',
    status: 'COMPLETED',
    handler: '이민아',
    outboundDate: '2025-01-12',
  },
])

// 필터링
const filteredList = computed(() =>
  outboundList.value.filter(
    (item) =>
      (!filters.value.type || item.type === filters.value.type) &&
      (!filters.value.status || item.status === filters.value.status) &&
      (!filters.value.search ||
        item.partnerName.includes(filters.value.search) ||
        item.productName.includes(filters.value.search))
  )
)
</script>
