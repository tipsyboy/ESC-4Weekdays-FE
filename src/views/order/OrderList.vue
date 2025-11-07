<template>
  <AppPageLayout>
    <!-- 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">주문 목록</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            전체 주문 현황을 조회합니다.
          </p>
        </div>

        <SearchBarComp
            v-model="query"
            placeholder="주문 코드를 입력하세요"
            @search="handleSearch"
        />
      </div>
    </template>

    <!-- 주문 목록 테이블 -->
    <TableComp :columns="columns" :data="pagedOrders">
      <!-- 주문 코드 -->
      <template #cell-orderCode="{ row }">
        <RouterLink
            :to="`/order/${row.id}`"
            class="text-primary font-semibold hover:underline"
        >
          {{ row.orderCode }}
        </RouterLink>
      </template>

      <!-- 납기일 -->
      <template #cell-dueDate="{ row }">
        {{ row.dueDate ? formatDate(row.dueDate) : '-' }}
      </template>

      <!-- 상태 -->
      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
      </template>
    </TableComp>

    <!-- 페이지네이션 -->
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
  </AppPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import TableComp from '@/components/common/TableComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import orderApi from '@/api/order/index.js'

const orders = ref([])
const query = ref('')
const page = ref(0)
const pageSize = 10
const total = ref(0)

const columns = [
  { key: 'orderCode', label: '주문 코드' },
  { key: 'franchiseName', label: '가맹점명' },
  { key: 'dueDate', label: '납기일' },
  { key: 'status', label: '상태' },
  { key: 'description', label: '비고' },
]

const totalPages = computed(() => Math.ceil(total.value / pageSize))
const pagedOrders = computed(() => orders.value)

const fetchOrderList = async () => {
  const res = await orderApi.orderRead(page.value, pageSize)
  const list = res?.results?.content || []
  total.value = res?.results?.totalElements || 0

  orders.value = list.map((item) => ({
    id: item.id,
    orderCode: item.orderCode,
    franchiseName: item.franchiseName,
    dueDate: item.dueDate,
    description: item.description || '-',
    status: item.orderStatus || 'REQUESTED', // 기본값
  }))
}

// 상태별 색상
const getStatusColor = (status) => {
  switch (status) {
    case 'REQUESTED': // 주문 생성
      return 'warning'
    case 'APPROVED': // 승인 완료
      return 'info'
    case 'SHIPPED': // 출하 완료
      return 'primary'
    case 'DELIVERED': // 배송 완료
      return 'success'
    case 'CANCELLED': // 취소
      return 'danger'
    default:
      return 'gray'
  }
}

// 상태별 라벨
const getStatusLabel = (status) => {
  switch (status) {
    case 'REQUESTED':
      return '주문 생성'
    case 'APPROVED':
      return '승인 완료'
    case 'SHIPPED':
      return '출하 완료'
    case 'DELIVERED':
      return '배송 완료'
    case 'CANCELLED':
      return '취소'
    default:
      return '미정'
  }
}

const changePage = (newPage) => {
  if (newPage < 0 || newPage >= totalPages.value) return
  page.value = newPage
  fetchOrderList()
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

onMounted(fetchOrderList)
</script>
