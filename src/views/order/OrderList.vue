<template>
  <AppPageLayout>
    <!-- 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold">주문 목록</h1>
          <p class="text-sm text-slate-500 mt-1">전체 주문 현황을 조회합니다.</p>
        </div>

        <SearchBarComp
            v-model="query"
            placeholder="주문 코드를 입력하세요"
            @search="handleSearch"
        />
      </div>
    </template>

    <!-- 확장형 테이블 -->
    <ExpandableTable
        :columns="mainColumns"
        :rows="orders"
        :sub-columns="subColumns"
        :expanded-ids="expandedIds"
        sub-key="items"
        link-key="orderCode"
        link-path="/order"
        @toggle-expand="toggleExpand"
    >
      <template #sub-row="{ subItem }">
        <td class="px-6 py-3 text-sm">{{ subItem.productName }}</td>
        <td class="px-6 py-3 text-sm">{{ subItem.quantity }}</td>
        <td class="px-6 py-3 text-sm">{{ subItem.unitPrice }}</td>
        <td class="px-6 py-3 text-sm">{{ subItem.totalPrice }}</td>
      </template>
    </ExpandableTable>

    <!-- 페이지네이션 -->
    <div class="flex items-center justify-center gap-2 mt-8">
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
  </AppPageLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ExpandableTable from '@/components/common/ExpandableTable.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'

import orderApi from '@/api/order/index.js'

const query = ref('')
const expandedIds = ref(new Set())

const pagination = reactive({
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 0,
})

const orders = ref([])

const mainColumns = [
  { key: 'orderCode', label: '주문 코드' },
  { key: 'franchiseName', label: '가맹점명' },
  { key: 'dueDate', label: '납기일' },
  { key: 'statusLabel', label: '상태' },
]

const subColumns = [
  { key: 'productName', label: '상품명' },
  { key: 'quantity', label: '수량' },
  { key: 'unitPrice', label: '단가' },
  { key: 'totalPrice', label: '총액' },
]

const fetchOrders = async (pageNum = 0) => {
  const res = await orderApi.orderRead(pageNum, pagination.size)

  const pageData = res?.results

  const paging = res?.results?.page

  // 페이지 값 안전하게 보정
  pagination.page = paging?.number ?? 0
  pagination.totalPages = paging?.totalPages ?? 1
  pagination.totalElements = paging?.totalElements ?? 0

  const list = pageData?.content || []

  // 확장형 테이블에 맞도록 items 추가
  orders.value = list.map(o => ({
    id: o.id,
    orderCode: o.orderCode,
    franchiseName: o.franchiseName,
    dueDate: o.dueDate?.split('T')[0] ?? '-',
    status: o.orderStatus,
    statusLabel: getStatusLabel(o.orderStatus),
    items: o.products || [], // 서브데이터
  }))
}

const handleSearch = () => {
  fetchOrders(0)
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'REQUESTED': return '주문 생성'
    case 'APPROVED': return '승인 완료'
    case 'SHIPPED': return '출하 완료'
    case 'DELIVERED': return '배송 완료'
    case 'CANCELLED': return '취소'
    default: return '미정'
  }
}

const toggleExpand = (id) => {
  if (expandedIds.value.has(id)) expandedIds.value.delete(id)
  else expandedIds.value.add(id)
}

const pageNumbers = computed(() => {
  const arr = []
  const max = 5

  let start = Math.max(0, pagination.page - Math.floor(max / 2))
  let end = Math.min(pagination.totalPages - 1, start + max - 1)

  if (end - start < max - 1) {
    start = Math.max(0, end - max + 1)
  }

  for (let i = start; i <= end; i++) arr.push(i)
  return arr
})

const goToPage = (p) => fetchOrders(p)
const goToFirstPage = () => fetchOrders(0)
const goToLastPage = () => fetchOrders(pagination.totalPages - 1)
const goToPreviousPage = () =>
    pagination.page > 0 && fetchOrders(pagination.page - 1)
const goToNextPage = () =>
    pagination.page < pagination.totalPages - 1 && fetchOrders(pagination.page + 1)

onMounted(() => {
  fetchOrders(0)
})
</script>
