<template>
  <AppPageLayout>
    <!-- 헤더 -->
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">발주 상세</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            발주 상세 내역을 확인합니다.
          </p>
        </div>

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
            icon="close"
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

    <!-- 상세 내용 -->
    <section
      v-if="order.id"
      class="bg-gray-50 dark:bg-slate-900/40 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 space-y-8"
    >
      <!-- 기본 정보 -->
      <div>
        <h2 class="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">기본 정보</h2>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 text-sm text-gray-700 dark:text-gray-200">
          <div>
            <p class="font-medium text-gray-500 dark:text-gray-400">발주번호</p>
            <p class="mt-1">{{ order.orderNumber }}</p>
          </div>

          <div>
            <p class="font-medium text-gray-500 dark:text-gray-400">공급업체</p>
            <p class="mt-1">{{ order.vendorName }}</p>
          </div>

          <div>
            <p class="font-medium text-gray-500 dark:text-gray-400">상태</p>
            <p class="mt-1">
              <BadgeComp
                :color="statusColor(order.status)"
                :label="getStatusLabel(order.status)"
              />
            </p>
          </div>

          <div>
            <p class="font-medium text-gray-500 dark:text-gray-400">발주일</p>
            <p class="mt-1">{{ formatDate(order.orderDate) }}</p>
          </div>

          <div>
            <p class="font-medium text-gray-500 dark:text-gray-400">입고 예정일</p>
            <p class="mt-1">{{ formatDate(order.expectedDate) }}</p>
          </div>

          <div>
            <p class="font-medium text-gray-500 dark:text-gray-400">총 금액</p>
            <p class="mt-1">{{ formatWon(order.totalAmount) }}</p>
          </div>

          <div class="col-span-2 md:col-span-3">
            <p class="font-medium text-gray-500 dark:text-gray-400">비고</p>
            <p class="mt-1">{{ order.description || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- 품목 목록 -->
      <div>
        <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">발주 품목 목록</h2>

        <TableComp
          :columns="itemColumns"
          :data="formattedItems"
          empty-text="등록된 품목이 없습니다."
        />
      </div>
    </section>

    <div
      v-else
      class="text-center py-20 text-slate-500 dark:text-slate-400"
    >
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

const formattedItems = computed(() =>
  order.value.items.map((item) => ({
    ...item,
    unitPrice: formatWon(item.unitPrice || 0),
    totalPrice: formatWon((item.unitPrice || 0) * (item.orderedQuantity || 0)),
  }))
)

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
  if (res.success && res.results) order.value = res.results
  else if (res.isSuccess && res.result) order.value = res.result
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
