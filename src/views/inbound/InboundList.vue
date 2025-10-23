<template>
  <AppPageLayout>
    <!-- ✅ 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">입고 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            입고 내역을 조회하고 관리합니다
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- 신규 입고 버튼 -->
          <RouterLink to="/inbound/create" class="w-40 whitespace-nowrap">
            <ButtonComp color="primary" icon="add">신규 입고</ButtonComp>
          </RouterLink>

          <!-- 상품 상세 조건 버튼 -->
          <ButtonComp color="secondary" icon="filter_alt" @click="isProductFilterOpen = true" class="w-40 whitespace-nowrap">
            상품 상세 조건
          </ButtonComp>

          <!-- 검색창 -->
          <SearchBarComp
              v-model="query"
              placeholder="입고서 검색..."
              @search="handleSearch"
          />
        </div>
      </div>
    </template>

    <!-- ✅ 필터 버튼 영역 -->
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

    <!-- ✅ 데이터 테이블 -->
    <TableComp :columns="columns" :data="pagedInbounds">
      <template #cell-id="{ row }">
        <RouterLink :to="`/inbound/detail`">
          <span class="text-primary font-semibold whitespace-nowrap">{{ row.id }}</span>
        </RouterLink>
      </template>

      <template #cell-purchaseOrderId="{ row }">
        <RouterLink v-if="row.purchaseOrderId" to="/purchase/detail">
          <span class="text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
            {{ row.purchaseOrderId }}
          </span>
        </RouterLink>
        <span v-else class="text-zinc-400">-</span>
      </template>

      <template #cell-amount="{ row }">
        {{ formatWon(row.amount) }}
      </template>

      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
      </template>
    </TableComp>

    <!-- ✅ 페이지네이션 -->
    <div class="flex justify-center items-center gap-2 mt-8">
      <ButtonComp
          color="secondary"
          icon="arrow_back"
          :disabled="page === 0"
          @click="changePage(page - 1)"
      />
      <span class="text-sm text-slate-600 whitespace-nowrap">
        페이지 {{ page + 1 }} / {{ totalPages }}
      </span>
      <ButtonComp
          color="secondary"
          icon="arrow_forward"
          :disabled="page >= totalPages - 1"
          @click="changePage(page + 1)"
      />
    </div>

    <!-- ✅ 상품 상세 조건 모달 -->
    <ProductFilterModal
        :open="isProductFilterOpen"
        @close="isProductFilterOpen = false"
        @apply="applyProductFilter"
    />
  </AppPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getStatusLabel, getStatusColor } from '@/utils/statusMapper.js'
import { formatWon } from '@/utils/format.js'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import ProductFilterModal from '@/components/common/ProductFilterModal.vue'

/* -------------------------------
   🔹 상태 및 필터 변수
-------------------------------- */
const query = ref('')
const filters = ['기간', '공급업체', '상태', '담당자']

const isProductFilterOpen = ref(false)
const productFilters = ref({})

/* -------------------------------
   🔹 테이블 컬럼 정의
-------------------------------- */
const columns = [
  { key: 'id', label: '입고 번호', width: '1%' },
  { key: 'purchaseOrderId', label: '발주 번호' },
  { key: 'status', label: '상태', align: 'center' },
  { key: 'supplier', label: '공급 업체' },
  { key: 'amount', label: '총액', align: 'right' },
  { key: 'receivedDate', label: '입고 날짜' },
  { key: 'inspector', label: '검수자' },
]

/* -------------------------------
   🔹 데이터
-------------------------------- */
const inbounds = ref([
  { id: 'IB-2023001', purchaseOrderId: 'PO-2023001', supplier: 'Supplier A', receivedDate: '2023-01-20', amount: 1500000, status: 'draft', inspector: '김철수' },
  { id: 'IB-2023002', purchaseOrderId: 'PO-2023002', supplier: 'Supplier B', receivedDate: '2023-02-25', amount: 2200000, status: 'in_progress', inspector: '이영희' },
  { id: 'IB-2023003', purchaseOrderId: 'PO-2023003', supplier: 'Supplier C', receivedDate: '2023-03-15', amount: 80000000, status: 'completed', inspector: '박민수' },
  { id: 'IB-2023004', purchaseOrderId: 'PO-2023004', supplier: 'Supplier A', receivedDate: '2023-03-22', amount: 12000000, status: 'completed', inspector: '김철수' },
  { id: 'IB-2023005', purchaseOrderId: 'PO-2023005', supplier: 'Supplier D', receivedDate: '2023-03-28', amount: 3100000, status: 'draft', inspector: '정수진' },
  { id: 'IB-2023006', purchaseOrderId: 'PO-2023006', supplier: 'Supplier B', receivedDate: '2023-04-01', amount: 2400000, status: 'in_progress', inspector: '이영희' },
])

/* -------------------------------
   🔹 상품 상세조건 적용
-------------------------------- */
const applyProductFilter = (filters) => {
  productFilters.value = filters
  console.log('상품 상세 조건 적용:', filters)
  handleSearch()
}

/* -------------------------------
   🔹 검색 및 필터링
-------------------------------- */
const handleSearch = () => {
  const params = {
    keyword: query.value,
    ...productFilters.value, // 상품 조건 병합
  }
  console.log('검색 요청 JSON:', JSON.stringify(params, null, 2))
  // 실제 API 요청 시
  // const res = await inboundApi.search(params)
  // inbounds.value = res.results
}

const filteredInbounds = computed(() => {
  if (!query.value) return inbounds.value
  return inbounds.value.filter((inb) =>
      Object.values(inb).some((val) =>
          String(val).toLowerCase().includes(query.value.toLowerCase())
      )
  )
})

/* -------------------------------
   🔹 페이지네이션
-------------------------------- */
const page = ref(0)
const pageSize = 3 // 한 페이지당 3개씩 표시

const totalPages = computed(() =>
    Math.ceil(filteredInbounds.value.length / pageSize)
)

const pagedInbounds = computed(() => {
  const start = page.value * pageSize
  return filteredInbounds.value.slice(start, start + pageSize)
})

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < totalPages.value) {
    page.value = newPage
  }
}
</script>
