<template>
  <AppPageLayout>
    <!-- Header 슬롯 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">작업 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            물류센터 내 모든 작업을 조회하고 관리합니다
          </p>
        </div>


      </div>
    </template>

    <!-- 필터 버튼 -->
    <div class="flex flex-wrap items-center gap-3 mb-8">
      <button
        v-for="filter in filters"
        :key="filter"
        class="flex items-center gap-2 rounded border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <span>{{ filter }}</span>
        <span class="material-symbols-outlined text-base">expand_more</span>
      </button>
    </div>

    <!-- 데이터 테이블 -->
    <TableComp :columns="columns" :data="filteredTasks">
      <template #cell-id="{ row }">
        <RouterLink :to="`/task/detail/${row.id}`">
          <span class="text-primary font-semibold hover:underline">{{ row.id }}</span>
        </RouterLink>
      </template>
      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
      </template>
    </TableComp>

    <!-- Footer -->
    <template #footer>
      <p class="text-xs text-gray-400 text-right">최근 업데이트: {{ lastUpdated }}</p>
    </template>
  </AppPageLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getStatusColor, getStatusLabel } from '@/utils/statusMapper.js'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import AppPageLayout from '@/layouts/AppPageLayout.vue'

const query = ref('')
const filters = ['기간', '작업유형', '상태', '담당자']
const lastUpdated = ref('2025-10-15 09:00')

// 컬럼
const columns = [
  { key: 'id', label: '작업 번호', width: '1%' },
  { key: 'type', label: '작업 유형' },
  { key: 'status', label: '상태', align: 'center' },
  { key: 'assignee', label: '담당자' },
  { key: 'createdAt', label: '생성일' },
  { key: 'updatedAt', label: '수정일' },
]

// 더미 데이터
const tasks = ref([
  {
    id: 'T-20251001',
    type: '입고 검수',
    status: 'assigned',
    assignee: '김철수',
    createdAt: '2025-10-14',
    updatedAt: '2025-10-15',
  },
  {
    id: 'T-20251002',
    type: '출고 피킹',
    status: 'in_progress',
    assignee: '이영희',
    createdAt: '2025-10-13',
    updatedAt: '2025-10-14',
  },
  {
    id: 'T-20251003',
    type: '적치 완료',
    status: 'completed',
    assignee: '박민수',
    createdAt: '2025-10-12',
    updatedAt: '2025-10-13',
  },
])

// 검색 필터링
const filteredTasks = computed(() => {
  if (!query.value) return tasks.value
  return tasks.value.filter((t) =>
    Object.values(t).some((val) => String(val).toLowerCase().includes(query.value.toLowerCase())),
  )
})

// 검색 실행
const handleSearch = () => {
  console.log('검색 실행:', query.value)
}
</script>
