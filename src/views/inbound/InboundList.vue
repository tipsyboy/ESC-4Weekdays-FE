<template>
  <AppPageLayout>
    <!-- 헤더 영역 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">입고 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            입고 내역을 조회하고 관리합니다
          </p>
        </div>

        <div class="flex items-center gap-3">
          <RouterLink to="/inbound/create" class="w-40 whitespace-nowrap">
            <ButtonComp color="primary" icon="add">신규 입고</ButtonComp>
          </RouterLink>

          <ButtonComp
            color="secondary"
            icon="filter_alt"
            @click="isProductFilterOpen = true"
            class="w-40 whitespace-nowrap"
          >
            상품 상세 조건
          </ButtonComp>

          <SearchBarComp v-model="query" placeholder="입고서 검색..." @search="handleSearch" />
        </div>
      </div>
    </template>

    <!-- 필터 버튼 -->
    <div class="flex flex-wrap items-center gap-3 mb-8">
      <button
        v-for="filter in filters"
        :key="filter"
        class="flex items-center gap-2 rounded border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
      >
        <span>{{ filter }}</span>
        <span class="material-symbols-outlined text-base">expand_more</span>
      </button>
    </div>

    <!-- 입고 목록 확장 테이블 -->
    <ExpandableTable
      :columns="mainColumns"
      :rows="inbounds"
      :sub-columns="subColumns"
      :expanded-ids="expandedIds"
      sub-key="items"
      link-key="inboundNumber"
      link-path="/inbound"
      @toggle-expand="toggleExpand"
    >
      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
      </template>

      <template #sub-row="{ subItem }">
        <td
          class="px-6 py-3 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          @click.stop="handleProductClick(subItem.productId)"
        >
          <span class="text-blue-600 dark:text-blue-400 hover:underline">
            {{ subItem.productCode }}
          </span>
        </td>
        <td class="px-6 py-3 text-sm">{{ subItem.productName }}</td>
        <td class="px-6 py-3 text-sm text-right font-medium">{{ subItem.receivedQuantity }}</td>
        <td class="px-6 py-3 text-sm">
          <span v-if="subItem.isFromPurchaseOrder" class="text-blue-600 dark:text-blue-400">
            발주품목
          </span>
          <span v-else class="text-gray-600 dark:text-gray-400"> 추가품목 </span>
        </td>
        <td class="px-6 py-3 text-sm">
          {{ subItem.description || '-' }}
        </td>
      </template>
    </ExpandableTable>

    <!-- 상품 필터 모달 -->
    <ProductFilterModal
      :open="isProductFilterOpen"
      @close="isProductFilterOpen = false"
      @apply="applyProductFilter"
    />
  </AppPageLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '@/api/inbound'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import ProductFilterModal from '@/components/common/ProductFilterModal.vue'
import ExpandableTable from '@/components/common/ExpandableTable.vue'

const inbounds = ref([])
const query = ref('')
const page = ref(0)
const pageSize = 10
const isProductFilterOpen = ref(false)
const expandedIds = ref(new Set())
const router = useRouter()

const filters = ['입고상태', '검수상태', '입고일자']

// 메인 테이블 컬럼 (입고 기준)
const mainColumns = [
  { key: 'inboundNumber', label: '입고번호' },
  { key: 'orderNumber', label: '발주번호' },
  { key: 'vendorName', label: '거래처명' },
  { key: 'status', label: '상태' },
  { key: 'managerName', label: '담당자' },
  { key: 'scheduledDate', label: '입고예정일' },
]

// 서브 테이블 컬럼 (입고 상품 목록)
const subColumns = [
  { key: 'productCode', label: '상품코드' },
  { key: 'productName', label: '상품명' },
  { key: 'receivedQuantity', label: '입고수량', align: 'right' },
  { key: 'type', label: '구분' },
  { key: 'description', label: '비고' },
]

const fetchInboundList = async () => {
  const res = await api.getInboundList({ page: page.value, size: pageSize })
  const list = res?.results?.content || res || []

  inbounds.value = list.map((item) => ({
    id: item.id,
    inboundNumber: item.inboundNumber,
    orderNumber: item.purchaseOrder?.orderNumber || '-',
    vendorName: item.purchaseOrder?.vendorName || '-',
    status: item.status,
    managerName: item.managerName,
    scheduledDate: formatDate(item.scheduledDate),
    items: item.items || [], // 입고 상품 목록
  }))
}

const handleSearch = () => {
  if (!query.value) return fetchInboundList()
  const q = query.value.toLowerCase()
  inbounds.value = inbounds.value.filter(
    (i) =>
      i.inboundNumber.toLowerCase().includes(q) ||
      i.orderNumber.toLowerCase().includes(q) ||
      i.vendorName.toLowerCase().includes(q),
  )
}

const handleProductClick = (productId) => {
  router.push(`/product/${productId}`)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const getStatusColor = (status) => {
  switch (status) {
    case 'SCHEDULED':
      return 'info'
    case 'INSPECTING':
      return 'warning'
    case 'COMPLETED':
      return 'success'
    case 'CANCELLED':
      return 'danger'
    default:
      return 'gray'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'SCHEDULED':
      return '입고예정'
    case 'INSPECTING':
      return '검수중'
    case 'COMPLETED':
      return '완료'
    case 'CANCELLED':
      return '취소'
    default:
      return '미정'
  }
}

// 토글 확장/축소
const toggleExpand = (inboundId) => {
  if (expandedIds.value.has(inboundId)) {
    expandedIds.value.delete(inboundId)
  } else {
    expandedIds.value.add(inboundId)
  }
}

// 상품 상세 조건 검색(모달창)
const applyProductFilter = async (filters) => {
  console.log('필터 적용:', filters)

  const params = {
    vendorIds: filters.vendors,
    productName: filters.name,
  }

  const res = await api.getInboundsSearch(params)
  const list = res?.results?.content || res || []

  inbounds.value = list.map((item) => ({
    id: item.id,
    inboundNumber: item.inboundNumber,
    orderNumber: item.purchaseOrder?.orderNumber || '-',
    vendorName: item.purchaseOrder?.vendorName || '-',
    status: item.status,
    managerName: item.managerName,
    scheduledDate: formatDate(item.scheduledDate),
    items: item.items || [], // 입고 상품 목록
  }))
  isProductFilterOpen.value = false
}

onMounted(fetchInboundList)
</script>
