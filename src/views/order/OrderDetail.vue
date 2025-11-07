<template>
  <AppPageLayout>
    <!-- 헤더 -->
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">주문 상세</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            주문의 상세 정보를 확인합니다.
          </p>
        </div>

        <div class="flex gap-3">
          <ButtonComp color="danger" @click="handleReject">
            거절하기
          </ButtonComp>
          <ButtonComp color="secondary" @click="goBack">
            뒤로가기
          </ButtonComp>
        </div>
      </div>
    </template>

    <!-- 주문 기본 정보 -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 space-y-3 mb-8">
      <div class="flex flex-wrap gap-6">
        <div class="w-full md:w-1/2">
          <p class="text-sm text-slate-500 dark:text-slate-400">주문 코드</p>
          <p class="text-lg font-semibold">{{ order.orderCode }}</p>
        </div>

        <div class="w-full md:w-1/2">
          <p class="text-sm text-slate-500 dark:text-slate-400">가맹점명</p>
          <p class="text-lg font-semibold">{{ order.franchiseName }}</p>
        </div>

        <div class="w-full md:w-1/2">
          <p class="text-sm text-slate-500 dark:text-slate-400">납기일</p>
          <p class="text-lg font-semibold">{{ formatDate(order.dueDate) }}</p>
        </div>

        <div class="w-full md:w-1/2">
          <p class="text-sm text-slate-500 dark:text-slate-400">비고</p>
          <p class="text-lg font-semibold">{{ order.description || '-' }}</p>
        </div>

        <!-- ✅ 상태 표시 -->
        <div class="w-full md:w-1/2">
          <p class="text-sm text-slate-500 dark:text-slate-400">상태</p>
          <BadgeComp
              :color="getStatusColor(order.orderStatus)"
              :label="getStatusLabel(order.orderStatus)"
          />
        </div>
      </div>
    </div>

    <!-- 주문 상품 목록 -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h2 class="text-xl font-semibold mb-4">주문 상품 목록</h2>

      <TableComp :columns="columns" :data="order.products">
        <template #cell-productName="{ row }">
          {{ row.productName }}
        </template>

        <template #cell-quantity="{ row }">
          {{ row.quantity }} 개
        </template>

        <template #cell-unitPrice="{ row }">
          {{ formatCurrency(row.unitPrice) }}
        </template>

        <template #cell-totalPrice="{ row }">
          {{ formatCurrency(row.totalPrice) }}
        </template>
      </TableComp>
    </div>
  </AppPageLayout>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import TableComp from '@/components/common/TableComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import orderApi from '@/api/order/index.js'

const route = useRoute()
const router = useRouter()
const order = ref({products: []})

const columns = [
  {key: 'productName', label: '상품명'},
  {key: 'quantity', label: '수량'},
  {key: 'unitPrice', label: '단가'},
  {key: 'totalPrice', label: '총액'},
]

const fetchOrderDetail = async () => {
  const orderId = route.params.id
  try {
    const res = await orderApi.orderDetail(orderId)
    order.value = res?.results || {}
  } catch (err) {
    console.error('주문 상세 조회 실패:', err)
  }
}

const handleReject = async () => {
  const orderId = route.params.id
  const res = await orderApi.orderReject(orderId)
  if (res.code === 400) {
    alert("거절 실패")
    return
  }
  router.push('/order')
}


// ✅ 상태 색상
const getStatusColor = (status) => {
  switch (status) {
    case 'REQUESTED':
      return 'warning'
    case 'APPROVED':
      return 'info'
    case 'SHIPPED':
      return 'primary'
    case 'DELIVERED':
      return 'success'
    case 'CANCELLED':
      return 'danger'
    default:
      return 'gray'
  }
}

// ✅ 상태 라벨
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

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const formatCurrency = (val) => {
  if (val == null) return '-'
  return val.toLocaleString('ko-KR') + ' 원'
}

const goBack = () => {
  router.push('/order')
}

onMounted(fetchOrderDetail)
</script>
