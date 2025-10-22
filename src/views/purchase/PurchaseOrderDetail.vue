<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">발주 상세</h1>

        <div class="flex gap-2">
          <ButtonComp
            color="primary"
            icon="check"
            :disabled="order.status !== 'REQUESTED'"
            @click="approveOrder"
          >
            승인
          </ButtonComp>

          <ButtonComp
            color="danger"
            icon="x"
            :disabled="order.status !== 'REQUESTED'"
            @click="cancelOrder"
          >
            취소
          </ButtonComp>

          <ButtonComp color="secondary" icon="arrow_back" @click="router.back()">
            뒤로가기
          </ButtonComp>
        </div>
      </div>
    </template>

    <section
      v-if="order.id"
      class="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700 space-y-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><strong>발주번호:</strong> {{ order.orderNumber }}</div>
        <div><strong>공급업체:</strong> {{ order.vendorName }}</div>
        <div><strong>발주일:</strong> {{ formatDate(order.orderDate) }}</div>
        <div><strong>입고예정일:</strong> {{ formatDate(order.expectedDate) }}</div>
        <div>
          <strong>상태:</strong>
          <BadgeComp :color="statusColor(order.status)" :label="getStatusLabel(order.status)" />
        </div>
        <div><strong>총금액:</strong> {{ formatWon(order.totalAmount) }}</div>
        <div class="md:col-span-2"><strong>비고:</strong> {{ order.description || '-' }}</div>
      </div>

      <!-- 품목 목록 -->
      <div>
        <h2 class="text-lg font-semibold mb-3">발주 품목 목록</h2>
        <TableComp :columns="itemColumns" :data="formattedItems" empty-text="등록된 품목이 없습니다." />
      </div>
    </section>

    <div v-else class="text-center py-20 text-slate-500 dark:text-slate-400">
      데이터를 불러오는 중입니다...
    </div>
  </AppPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/purchase'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import { formatDate, formatWon } from '@/utils/format.js'
import { getStatusLabel } from '@/utils/statusMapper.js'

const route = useRoute()
const router = useRouter()
const order = ref({ items: [] })

const itemColumns = [
  { key: 'productName', label: '상품명' },
  { key: 'unitPrice', label: '단가', align: 'right' },
  { key: 'orderedQuantity', label: '수량', align: 'right' },
  { key: 'totalPrice', label: '금액', align: 'right' },
]

// 상품별 금액 계산된 데이터
const formattedItems = computed(() =>
  order.value.items.map((item) => ({
    ...item,
    unitPrice: formatWon(item.unitPrice || 0),
    totalPrice: formatWon((item.unitPrice || 0) * (item.orderedQuantity || 0)),
  })),
)

// 상태 색상 매핑
const statusColor = (status) => {
  switch (status) {
    case 'REQUESTED':
      return 'warning'
    case 'APPROVED':
      return 'success'
    case 'CANCELLED':
      return 'danger'
    default:
      return 'secondary'
  }
}

const loadDetail = async () => {
  const res = await api.getPurchaseOrderDetail(route.params.id)
  if (res.success && res.results) {
    order.value = res.results
  } else if (res.isSuccess && res.result) {
    order.value = res.result
  }
}

const approveOrder = async () => {
  if (!confirm('해당 발주를 승인하시겠습니까?')) return
  const res = await api.approvePurchaseOrder(route.params.id)
  if (res.success || res.isSuccess) {
    alert('발주가 승인되었습니다.')
    await loadDetail()
  }
}

const cancelOrder = async () => {
  if (!confirm('해당 발주를 취소하시겠습니까?')) return
  const res = await api.cancelPurchaseOrder(route.params.id)
  if (res.success || res.isSuccess) {
    alert('발주가 취소되었습니다.')
    await loadDetail()
  }
}

onMounted(loadDetail)
</script>
