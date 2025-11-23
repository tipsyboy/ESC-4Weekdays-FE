<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">발주 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">발주 내역을 조회하고 관리합니다</p>
        </div>

        <div class="flex items-center gap-3">
          <RouterLink to="/purchase/create" class="whitespace-nowrap">
            <ButtonComp color="primary" icon="add">신규 발주</ButtonComp>
          </RouterLink>
<!--          <SearchBarComp-->
<!--            v-model="query"-->
<!--            placeholder="발주서 검색..."-->
<!--            @search="handleSearch"-->
<!--          />-->
        </div>
      </div>
    </template>

<!--    <div class="flex flex-wrap items-center gap-3 mb-8">-->
<!--      <button-->
<!--        v-for="filter in filters"-->
<!--        :key="filter"-->
<!--        class="flex items-center gap-2 rounded border border-zinc-300 dark:border-zinc-700-->
<!--               bg-background-light dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700-->
<!--               dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"-->
<!--      >-->
<!--        <span>{{ filter }}</span>-->
<!--        <span class="material-symbols-outlined text-base">expand_more</span>-->
<!--      </button>-->
<!--    </div>-->

    <!-- 발주 목록 확장 테이블 -->
    <ExpandableTable
      :columns="mainColumns"
      :rows="filteredOrders"
      :sub-columns="subColumns"
      :expanded-ids="expandedIds"
      sub-key="items"
      link-key="orderNumber"
      link-path="/purchase"
      @toggle-expand="toggleExpand"
    >
      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
      </template>

      <template #cell-totalAmount="{ row }">
        {{ formatWon(row.totalAmount) }}
      </template>

      <template #cell-orderDate="{ row }">
        {{ formatDate(row.orderDate) }}
      </template>

      <template #cell-expectedDate="{ row }">
        {{ formatDate(row.expectedDate) }}
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
        <td class="px-6 py-3 text-sm text-middle font-medium">{{ subItem.productName }}</td>
        <td class="px-6 py-3 text-sm text-right font-medium">{{ subItem.orderedQuantity }}</td>
        <td class="px-6 py-3 text-sm text-right">{{ formatWon(subItem.unitPrice) }}</td>
        <td class="px-6 py-3 text-sm text-right font-semibold">{{ formatWon(subItem.totalPrice) }}</td>
        <td class="px-6 py-3 text-sm">{{ subItem.description || '-' }}</td>
      </template>
    </ExpandableTable>
  </AppPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '@/api/purchase'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import ExpandableTable from '@/components/common/ExpandableTable.vue'
import { formatDate, formatWon } from '@/utils/format.js'
import { getStatusLabel, getStatusColor } from '@/utils/statusMapper.js'

const filters = ['기간', '공급업체', '상태']

const list = ref([])
const query = ref('')
const expandedIds = ref(new Set())

const router = useRouter()

// 메인 테이블 컬럼 (발주 기준)
const mainColumns = [
  { key: 'orderNumber', label: '발주 번호' },
  { key: 'vendorName', label: '공급 업체' },
  { key: 'status', label: '상태', align: 'center' },
  { key: 'totalAmount', label: '총 금액', align: 'right' },
  { key: 'orderDate', label: '발주일' },
  { key: 'expectedDate', label: '입고 예정일' },
]

// 서브 테이블 컬럼 (발주 상품 목록)
const subColumns = [
  { key: 'productCode', label: '상품코드' },
  { key: 'productName', label: '상품명' },
  { key: 'orderedQuantity', label: '발주수량', align: 'right' },
  { key: 'unitPrice', label: '단가', align: 'right' },
  { key: 'totalPrice', label: '금액', align: 'right' },
  { key: 'description', label: '비고' },
]

// 데이터 로드
onMounted(async () => {
  const res = await api.getPurchaseOrders({ page: 0, size: 20 })
  if (res.success || res.isSuccess) {
    list.value = res.results?.content || res.result?.content || []
  }
})

// 검색 필터링
const filteredOrders = computed(() => {
  if (!query.value) return list.value
  const keyword = query.value.toLowerCase()
  return list.value.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(keyword) ||
      order.vendorName.toLowerCase().includes(keyword),
  )
})

const handleSearch = () => {
  console.log('검색 실행:', query.value)
}

// 토글 확장/축소
const toggleExpand = (orderId) => {
  if (expandedIds.value.has(orderId)) {
    expandedIds.value.delete(orderId)
  } else {
    expandedIds.value.add(orderId)
  }
}

// 상품 클릭 시 상품 상세 페이지로 이동
const handleProductClick = (productId) => {
  router.push(`/product/${productId}`)
}
</script>