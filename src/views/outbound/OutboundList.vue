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

    <!-- 출고 목록 확장 테이블 -->
    <ExpandableTable
      :columns="columns"
      :rows="state.outbounds"
      :sub-columns="subColumns"
      :expanded-ids="expandedIds"
      sub-key="outboundProductItems"
      link-key="outboundCode"
      link-id-key="id"
      link-path="/outbound"
      @toggle-expand="toggleExpand"
    >
      <!-- 상태 커스텀 셀 -->
      <template #cell-status="{ row }">
        <BadgeComp :label="getStatusLabel(row.status)" :color="getStatusColor(row.status)" />
      </template>

      <!-- 하위 로우 (출고 품목) -->
      <template #sub-row="{ subItem }">
        <td
          class="px-6 py-3 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          @click.stop="handleProductClick(subItem.productId)"
        >
          <span class="text-blue-600 dark:text-blue-400 hover:underline">
            {{ subItem.productCode || subItem.productId }}
          </span>
        </td>

        <td class="px-6 py-3 text-sm">{{ subItem.productName }}</td>

        <td class="px-6 py-3 text-sm text-right font-medium">{{ subItem.orderedQuantity }}</td>

        <td class="px-6 py-3 text-sm">{{ subItem.locationCode || '-' }}</td>

        <td class="px-6 py-3 text-sm">{{ subItem.description || '-' }}</td>
      </template>
    </ExpandableTable>

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
import { onMounted, reactive, computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import ExpandableTable from '@/components/common/ExpandableTable.vue'
import OutboundApi from '@/api/outbound/index.js'

const router = useRouter()

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

// 테이블 컬럼 (메인)
const columns = [
  { key: 'outboundCode', label: '출고 코드' },
  { key: 'status', label: '상태' },
  { key: 'outboundManagerName', label: '담당자' },
  { key: 'scheduledDate', label: '예정일' },
]

// 서브 컬럼 (출고 품목)
const subColumns = [
  { key: 'productCode', label: '상품코드' },
  { key: 'productName', label: '상품명' },
  { key: 'orderedQuantity', label: '출고수량', align: 'right' },
  { key: 'locationCode', label: '적재위치' },
  { key: 'description', label: '비고' },
]

// expandedIds은 Set 형태로 유지 (ExpandableTable이 Set을 기대)
const expandedIds = ref(new Set())

onMounted(() => {
  fetchOutbounds()
})

const fetchOutbounds = async (pageNum = 0, params = {}) => {
  try {
    const result = await OutboundApi.outboundRead(pageNum, pagination.size, params)
    if (!result || !result.results) {
      state.outbounds = []
      pagination.page = 0
      pagination.totalPages = 1
      pagination.totalElements = 0
      return
    }

    const pageData = result.results.page
    // API 응답의 content 구조을 그대로 할당 (하위 리스트: outboundProductItems)
    state.outbounds = (result.results.content || []).map(o => ({
      // 보수적으로 필요한 필드만 보장
      id: o.id,
      outboundCode: o.outboundCode,
      outboundType: o.outboundType,
      status: o.status,
      orderId: o.orderId,
      outboundManagerName: o.outboundManagerName,
      scheduledDate: o.scheduledDate,
      description: o.description,
      outboundProductItems: (o.outboundProductItems || []).map(si => ({
        id: si.id,
        productId: si.productId,
        // productCode는 API 샘플에 없으므로 productId fallback
        productCode: si.productCode || si.productId,
        productName: si.productName,
        orderedQuantity: si.orderedQuantity,
        locationCode: si.locationCode,
        description: si.description
      }))
    }))

    Object.assign(pagination, {
      page: pageData.number,
      totalPages: pageData.totalPages,
      totalElements: pageData.totalElements,
    })
  } catch (error) {
    console.error('fetchOutbounds error', error)
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
  // 페이지 초기화
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

const getTypeLabel = (type) => {
  const labels = {
    'SALE': '판매',
    'RETURN': '반품',
    'TRANSFER': '이동'
  }
  return labels[type] || type
}

const getTypeColor = (type) => {
  const colors = {
    'SALE': 'primary',
    'RETURN': 'warning',
    'TRANSFER': 'info'
  }
  return colors[type] || 'default'
}

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

// ExpandableTable 의 toggle 이벤트 처리: Set을 직접 수정
const toggleExpand = (id) => {
  if (!id && id !== 0) return
  if (expandedIds.value.has(id)) expandedIds.value.delete(id)
  else expandedIds.value.add(id)
}

// 상품 클릭 시 상세로 이동
const handleProductClick = (productId) => {
  if (!productId) return
  router.push(`/product/${productId}`)
}

// pagination helpers
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
