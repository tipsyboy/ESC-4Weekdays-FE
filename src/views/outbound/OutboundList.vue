<template>
  <AppPageLayout>
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="text-2xl font-semibold">출고 관리</h1>
          <p class="text-gray-500 text-sm mt-1">
            출고 내역을 조회하고 관리합니다. (총 {{ pagination.totalElements.toLocaleString() }}개)
          </p>
        </div>

        <div class="flex items-center gap-3">
          <ButtonComp color="secondary" icon="filter_list" @click="openFilterModal">
            상세 검색
          </ButtonComp>
          <RouterLink to="/outbound/create">
            <ButtonComp color="primary" icon="add">신규 출고</ButtonComp>
          </RouterLink>
        </div>
      </div>
    </template>

    <!-- 필터 버튼 영역 -->
    <div class="flex flex-wrap items-center gap-3 mb-8">
      <!-- 검색 조건 표시 -->
      <div v-if="hasActiveFilters" class="flex items-center gap-2">
        <span class="text-sm text-zinc-500">검색 조건:</span>
        <div v-if="searchForm.outboundCode" class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
          <span>출고코드: {{ searchForm.outboundCode }}</span>
          <button @click="clearFilter('outboundCode')" class="text-blue-600 hover:text-blue-800">×</button>
        </div>
        <div v-if="searchForm.outboundType" class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
          <span>출고유형: {{ getTypeLabel(searchForm.outboundType) }}</span>
          <button @click="clearFilter('outboundType')" class="text-blue-600 hover:text-blue-800">×</button>
        </div>
        <div v-if="searchForm.status" class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
          <span>상태: {{ getStatusLabel(searchForm.status) }}</span>
          <button @click="clearFilter('status')" class="text-blue-600 hover:text-blue-800">×</button>
        </div>
        <div v-if="searchForm.outboundManagerName" class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
          <span>담당자: {{ searchForm.outboundManagerName }}</span>
          <button @click="clearFilter('outboundManagerName')" class="text-blue-600 hover:text-blue-800">×</button>
        </div>
        <button @click="clearAllFilters" class="text-xs text-red-600 hover:text-red-800 underline">
          전체 초기화
        </button>
      </div>
    </div>

    <!-- 출고 목록 테이블 -->
    <TableComp :columns="columns" :data="state.outbounds">
      <!-- 출고 코드 -->
      <template #cell-outboundCode="{ row }">
        <RouterLink
          :to="`/outbound/${row.id}`"
          class="text-blue-600 hover:underline font-medium"
        >
          {{ row.outboundCode }}
        </RouterLink>
      </template>

      <!-- 출고 유형 -->
      <template #cell-outboundType="{ row }">
        <BadgeComp :label="getTypeLabel(row.outboundType)" :color="getTypeColor(row.outboundType)" />
      </template>

      <!-- 상태 -->
      <template #cell-status="{ row }">
        <BadgeComp :label="getStatusLabel(row.status)" :color="getStatusColor(row.status)" />
      </template>

      <!-- 예정일 -->
      <template #cell-scheduledDate="{ row }">
        {{ formatDate(row.scheduledDate) }}
      </template>
    </TableComp>

    <!-- 페이지네이션 -->
    <div class="flex items-center justify-center gap-2 mt-6">
      <ButtonComp
        color="secondary"
        icon="first_page"
        :disabled="pagination.page === 0"
        @click="goToFirstPage"
      />
      <ButtonComp
        color="secondary"
        icon="arrow_back"
        :disabled="pagination.page === 0"
        @click="goToPreviousPage"
      />
      <button
        v-for="pageNum in pageNumbers"
        :key="pageNum"
        @click="goToPage(pageNum)"
        :class="[
          'min-w-[40px] h-10 px-4 rounded-lg font-medium text-sm transition-colors',
          pageNum === pagination.page
            ? 'bg-emerald-600 text-white'
            : 'bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-700',
        ]"
      >
        {{ pageNum + 1 }}
      </button>
      <ButtonComp
        color="secondary"
        icon="arrow_forward"
        :disabled="pagination.page >= pagination.totalPages - 1"
        @click="goToNextPage"
      />
      <ButtonComp
        color="secondary"
        icon="last_page"
        :disabled="pagination.page >= pagination.totalPages - 1"
        @click="goToLastPage"
      />
    </div>

    <!-- 검색 모달 -->
    <OutboundSearchModal
      :is-open="state.isFilterModalOpen"
      :initial-params="searchForm"
      @close="closeFilterModal"
      @search="handleSearch"
    />
  </AppPageLayout>
</template>

<script setup>
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import { onMounted, reactive, computed } from 'vue'
import OutboundApi from '@/api/outbound/index.js'

const state = reactive({
  outbounds: [],
  isFilterModalOpen: false,
})

const pagination = reactive({
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 0,
})

const searchForm = reactive({
  outboundCode: '',
  outboundType: '',
  status: '',
  outboundManagerName: '',
  scheduledDateFrom: '',
  scheduledDateTo: ''
})

// 테이블 컬럼
const columns = [
  { key: 'outboundCode', label: '출고 코드' },
  { key: 'status', label: '상태' },
  { key: 'orderId', label: '주문 ID', align: 'right' },
  { key: 'outboundManagerName', label: '담당자' },
  { key: 'scheduledDate', label: '예정일' },
  { key: 'description', label: '비고' },
]

onMounted(() => {
  fetchOutbounds()
})

const fetchOutbounds = async (pageNum = 0, params = {}) => {
  try {
    const result = await OutboundApi.outboundRead(pageNum, pagination.size, params)
    console.log(result)

    const pageData = result.results.page
    state.outbounds = result.results.content

    Object.assign(pagination, {
      page: pageData.number,
      totalPages: pageData.totalPages,
      totalElements: pageData.totalElements,
    })
  } catch (error) {
    console.error(error)
  }
}

const openFilterModal = () => {
  state.isFilterModalOpen = true
}

const closeFilterModal = () => {
  state.isFilterModalOpen = false
}

const handleSearch = (params) => {
  Object.assign(searchForm, params)
  fetchOutbounds(0, searchForm)
}

const clearFilter = (key) => {
  searchForm[key] = ''
  fetchOutbounds(0, searchForm)
}

const clearAllFilters = () => {
  Object.keys(searchForm).forEach(key => searchForm[key] = '')
  fetchOutbounds(0, {})
}

const hasActiveFilters = computed(() => {
  return Object.values(searchForm).some(v => v !== '')
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr.split('T')[0]
}

// 출고 유형 라벨
const getTypeLabel = (type) => {
  const labels = {
    'SALE': '판매',
    'RETURN': '반품',
    'TRANSFER': '이동'
  }
  return labels[type] || type
}

// 출고 유형 색상
const getTypeColor = (type) => {
  const colors = {
    'SALE': 'primary',
    'RETURN': 'warning',
    'TRANSFER': 'info'
  }
  return colors[type] || 'default'
}

// 상태 라벨
const getStatusLabel = (status) => {
  const labels = {
    'REQUESTED': '요청',
    'APPROVED': '승인',
    'PICKING': '피킹',
    'PACKING': '패킹',
    'INSPECTION': '검수',
    'SHIPPED': '출고완료',
    'CANCELLED': '취소'
  }
  return labels[status] || status
}

// 상태 색상
const getStatusColor = (status) => {
  const colors = {
    'REQUESTED': 'info',
    'APPROVED': 'info',
    'PICKING': 'warning',
    'PACKING': 'warning',
    'INSPECTION': 'warning',
    'SHIPPED': 'success',
    'CANCELLED': 'danger'
  }
  return colors[status] || 'default'
}

const pageNumbers = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  let startPage = Math.max(0, pagination.page - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(pagination.totalPages - 1, startPage + maxPagesToShow - 1)
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(0, endPage - maxPagesToShow + 1)
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

const goToPage = (pageNum) => fetchOutbounds(pageNum, searchForm)
const goToFirstPage = () => fetchOutbounds(0, searchForm)
const goToLastPage = () => fetchOutbounds(pagination.totalPages - 1, searchForm)
const goToPreviousPage = () => pagination.page > 0 && fetchOutbounds(pagination.page - 1, searchForm)
const goToNextPage = () => pagination.page < pagination.totalPages - 1 && fetchOutbounds(pagination.page + 1, searchForm)
</script>