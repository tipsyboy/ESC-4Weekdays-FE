<template>
  <AppPageLayout>
    <!-- 페이지 헤더 -->
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="text-2xl font-semibold">재고 관리</h1>
          <p class="text-gray-500 text-sm mt-1">
            현재 보유 중인 상품 재고 내역을 확인할 수 있습니다. (총 {{ pagination.totalElements.toLocaleString() }}개)
          </p>
        </div>

        <div class="flex items-center gap-3">
          <ButtonComp color="secondary" icon="filter_list" @click="openFilterModal">
            상세 검색
          </ButtonComp>
        </div>
      </div>
    </template>

    <!-- 필터 버튼 영역 -->
    <div class="flex flex-wrap items-center gap-3 mb-8">
<!--      &lt;!&ndash; 입고일 필터 &ndash;&gt;-->
<!--      <div class="flex items-center gap-2 text-sm">-->
<!--        <label class="text-zinc-700 dark:text-zinc-300">입고일</label>-->
<!--        <input-->
<!--          v-model="quickFilters.inboundDateFrom"-->
<!--          type="date"-->
<!--          class="border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-1 bg-background-light dark:bg-zinc-900 focus:ring-1 focus:ring-primary/50 outline-none"-->
<!--          @change="applyQuickFilters"-->
<!--        />-->
<!--        <span class="text-zinc-500">~</span>-->
<!--        <input-->
<!--          v-model="quickFilters.inboundDateTo"-->
<!--          type="date"-->
<!--          class="border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-1 bg-background-light dark:bg-zinc-900 focus:ring-1 focus:ring-primary/50 outline-none"-->
<!--          @change="applyQuickFilters"-->
<!--        />-->
<!--      </div>-->

      <!-- 검색 조건 표시 -->
      <div v-if="hasActiveFilters" class="flex items-center gap-2">
        <span class="text-sm text-zinc-500">검색 조건:</span>
        <div v-if="searchForm.productCode" class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
          <span>상품코드: {{ searchForm.productCode }}</span>
          <button @click="clearFilter('productCode')" class="text-blue-600 hover:text-blue-800">×</button>
        </div>
        <div v-if="searchForm.productName" class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
          <span>상품명: {{ searchForm.productName }}</span>
          <button @click="clearFilter('productName')" class="text-blue-600 hover:text-blue-800">×</button>
        </div>
        <div v-if="searchForm.locationCode" class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
          <span>위치: {{ searchForm.locationCode }}</span>
          <button @click="clearFilter('locationCode')" class="text-blue-600 hover:text-blue-800">×</button>
        </div>
        <button @click="clearAllFilters" class="text-xs text-red-600 hover:text-red-800 underline">
          전체 초기화
        </button>
      </div>
    </div>

    <!-- 상품 리스트 -->
    <ExpandableTable
      :columns="state.mainColumns"
      :rows="state.inventories"
      :sub-columns="state.subColumns"
      :expanded-ids="expandedIds"
      sub-key="inventories"
      link-key="productCode"
      link-path="/product"
      @toggle-expand="toggleExpand"
    >
      <template #sub-row="{ subItem }">
        <td class="px-6 py-3 text-sm">{{ subItem.locationCode || '-' }}</td>
        <td class="px-6 py-3 text-sm">{{ subItem.lotNumber || '-' }}</td>
        <td class="px-6 py-3 text-sm text-right font-medium">{{ subItem.quantity.toLocaleString() }}</td>
        <td class="px-6 py-3 text-sm">{{ subItem.inboundCode || '-' }}</td>
        <td class="px-6 py-3 text-sm">
          {{ subItem.inboundDate ? formatDate(subItem.inboundDate) : '-' }}
        </td>
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
    <InventorySearchModal
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
import ExpandableTable from '@/components/common/ExpandableTable.vue'
import InventorySearchModal from '@/views/inventory/InventorySearchModal.vue'
import { onMounted, reactive, ref, computed } from 'vue'
import InventoryApi from '@/api/inventory/index.js'

const state = reactive({
  inventories: [],
  isFilterModalOpen: false,

  mainColumns: [
    { key: 'productCode', label: '상품 코드' },
    { key: 'productName', label: '상품명' },
    { key: 'totalQuantity', label: '총 수량' },
    { key: 'vendorName', label: '공급 업체' },
  ],

  subColumns: [
    { key: 'locationCode', label: '보관 위치' },
    { key: 'lotNumber', label: 'LOT 번호' },
    { key: 'quantity', label: '수량', align: 'right' },
    { key: 'inboundCode', label: '입고 코드' },
    { key: 'inboundDate', label: '입고일' },
  ],
})

const pagination = reactive({
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 0,
})

const searchForm = reactive({
  productCode: '',
  productName: '',
  locationCode: '',
  lotNumber: '',
  inboundCode: '',
  inboundDateFrom: '',
  inboundDateTo: ''
})

const quickFilters = reactive({
  inboundDateFrom: '',
  inboundDateTo: ''
})

const expandedIds = ref(new Set())

onMounted(() => {
  fetchInventories()
})

const fetchInventories = async (pageNum = 0, params = {}) => {
  try {
    const result = await InventoryApi.getProductInventoryList(pageNum, pagination.size, params)
    console.log(result)

    const pageData = result.results.page
    state.inventories = result.results.content

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
  Object.assign(quickFilters, {
    inboundDateFrom: params.inboundDateFrom,
    inboundDateTo: params.inboundDateTo
  })
  fetchInventories(0, searchForm)
}

const applyQuickFilters = () => {
  searchForm.inboundDateFrom = quickFilters.inboundDateFrom
  searchForm.inboundDateTo = quickFilters.inboundDateTo
  fetchInventories(0, searchForm)
}

const clearFilter = (key) => {
  searchForm[key] = ''
  if (key === 'inboundDateFrom' || key === 'inboundDateTo') {
    quickFilters[key] = ''
  }
  fetchInventories(0, searchForm)
}

const clearAllFilters = () => {
  Object.keys(searchForm).forEach(key => searchForm[key] = '')
  Object.keys(quickFilters).forEach(key => quickFilters[key] = '')
  fetchInventories(0, {})
}

const hasActiveFilters = computed(() => {
  return Object.values(searchForm).some(v => v !== '')
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr.split('T')[0]
}

const toggleExpand = (productId) => {
  if (expandedIds.value.has(productId)) {
    expandedIds.value.delete(productId)
  } else {
    expandedIds.value.add(productId)
  }
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

const goToPage = (pageNum) => fetchInventories(pageNum, searchForm)
const goToFirstPage = () => fetchInventories(0, searchForm)
const goToLastPage = () => fetchInventories(pagination.totalPages - 1, searchForm)
const goToPreviousPage = () => pagination.page > 0 && fetchInventories(pagination.page - 1, searchForm)
const goToNextPage = () => pagination.page < pagination.totalPages - 1 && fetchInventories(pagination.page + 1, searchForm)
</script>