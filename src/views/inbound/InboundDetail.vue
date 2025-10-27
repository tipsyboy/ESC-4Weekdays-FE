<template>
  <AppPageLayout>
    <!-- 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
            {{ inbound?.inboundNumber || '입고 상세' }}
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            생성일: {{ formatDate(inbound.createdAt) }}
          </p>
        </div>

        <div class="flex gap-2">
          <ButtonComp color="secondary" icon="arrow_back" @click="router.push('/inbound')">
            뒤로가기
          </ButtonComp>
          <ButtonComp v-if="inbound.status === 'SCHEDULED'" color="primary" icon="done_all">
            입고 완료
          </ButtonComp>
          <ButtonComp color="secondary" icon="edit">수정</ButtonComp>
          <ButtonComp color="secondary" icon="print">인쇄</ButtonComp>
        </div>
      </div>
    </template>

    <section v-if="inbound" class="space-y-8">
      <!-- 입고 정보 -->
      <div
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
               rounded-xl shadow-sm p-6"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">입고 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <div>
            <span class="text-xs text-slate-500 block mb-1">상태</span>
            <BadgeComp :color="getStatusColor(inbound.status)">
              {{ getStatusLabel(inbound.status) }}
            </BadgeComp>
          </div>

          <div>
            <span class="text-xs text-slate-500 block mb-1">연결된 발주서</span>
            <RouterLink
              v-if="inbound.purchaseOrder"
              :to="`/purchase/detail/${inbound.purchaseOrder.id}`"
              class="text-sm text-primary hover:underline font-medium"
            >
              {{ inbound.purchaseOrder.orderNumber }}
            </RouterLink>
            <span v-else class="text-sm text-gray-400">-</span>
          </div>

          <div>
            <span class="text-xs text-slate-500 block mb-1">공급자</span>
            <span class="text-sm">{{ inbound.purchaseOrder?.vendorName || '-' }}</span>
          </div>

          <div>
            <span class="text-xs text-slate-500 block mb-1">입고 예정일</span>
            <span class="text-sm">{{ formatDate(inbound.scheduledDate) }}</span>
          </div>

          <div class="col-span-3 pt-2">
            <span class="text-xs text-slate-500 block mb-1">비고</span>
            <div
              class="border rounded-lg p-3 text-sm bg-zinc-50 dark:bg-zinc-900/40
                     text-zinc-700 dark:text-zinc-300"
            >
              {{ inbound.description || '비고 없음' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 입고 품목 -->
      <div
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
               rounded-xl shadow-sm p-6"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">입고 품목</h2>

        <TableComp :columns="itemColumns" :data="inbound.items || []">
          <template #cell-productName="{ row }">
            {{ row.productName }}
          </template>
          <template #cell-orderedQuantity="{ row }">
            <span class="block text-right font-mono">{{ row.orderedQuantity }}</span>
          </template>
          <template #cell-receivedQuantity="{ row }">
            <span class="block text-right font-mono font-semibold">{{ row.receivedQuantity }}</span>
          </template>
        </TableComp>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/inbound'

import AppPageLayout from '@/layouts/AppPageLayout.vue'
import TableComp from '@/components/common/TableComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'

const route = useRoute()
const router = useRouter()
const inbound = ref({})

// 컬럼 정의
const itemColumns = [
  { key: 'productName', label: '품목명' },
  { key: 'orderedQuantity', label: '발주 수량', align: 'right' },
  { key: 'receivedQuantity', label: '입고 수량', align: 'right' },
]

// 상태 색상/라벨
const getStatusColor = (status) => {
  switch (status) {
    case 'SCHEDULED': return 'blue'
    case 'INSPECTING': return 'yellow'
    case 'COMPLETED': return 'green'
    case 'CANCELLED': return 'red'
    default: return 'gray'
  }
}
const getStatusLabel = (status) => {
  switch (status) {
    case 'SCHEDULED': return '입고예정'
    case 'INSPECTING': return '검수중'
    case 'COMPLETED': return '완료'
    case 'CANCELLED': return '취소'
    default: return '미정'
  }
}

// 날짜 포맷
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 상세 조회
const fetchInboundDetail = async () => {
  const res = await api.getInboundDetail(route.params.id)
  if (res.success) {
    inbound.value = res.results
  } else {
    console.error('입고 상세 조회 실패:', res)
  }
}

onMounted(fetchInboundDetail)
</script>