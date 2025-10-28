<template>
  <AppPageLayout>
    <!-- 상단 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
            {{ product.name }}
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            상품 코드: {{ product.code }}
          </p>
        </div>

        <div class="flex gap-2">
          <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">
            뒤로가기
          </ButtonComp>
          <ButtonComp color="secondary" icon="edit">
            수정
          </ButtonComp>
          <ButtonComp color="secondary" icon="print">인쇄</ButtonComp>
        </div>
      </div>
    </template>

    <!-- 본문 -->
    <section class="space-y-8">
      <!-- 상품 정보 -->
      <div class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6 backdrop-blur-sm">
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">상품 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <!-- 상품 코드 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">상품 코드</span>
            <RouterLink :to="`/product/detail/${product.code}`"
                        class="text-sm font-medium text-primary hover:underline">
              {{ product.code }}
            </RouterLink>
          </div>

          <!-- 상품 이름 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">상품 이름</span>
            <span class="text-sm font-medium">{{ product.name }}</span>
          </div>

          <!-- 총 재고 수량 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">총 재고 수량</span>
            <span class="text-sm font-medium">{{ product.totalQuantity }} EA</span>
          </div>

          <!-- 단가 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">단가</span>
            <span class="text-sm font-medium">{{ formatWon(product.unitPrice) }}</span>
          </div>

          <!-- 총 금액 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">총 금액</span>
            <span class="text-sm font-medium">{{ formatWon(product.totalAmount) }}</span>
          </div>

          <!-- 공급 업체 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">공급 업체</span>
            <span class="text-sm font-medium">{{ product.vendor }}</span>
          </div>
        </div>
      </div>

      <!-- 재고 상세 목록 -->
      <div class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6 backdrop-blur-sm">
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">재고 상세 목록</h2>

        <TableComp :columns="inventoryColumns" :data="inventoryList">
          <template #cell-lotNumber="{ row }">
            <span class="font-medium text-slate-900 dark:text-white">{{ row.lotNumber }}</span>
          </template>

          <template #cell-center="{ row }">
            <span>{{ row.center }}</span>
          </template>

          <template #cell-location="{ row }">
            <span class="font-medium">{{ row.location }}</span>
          </template>

          <template #cell-quantity="{ row }">
            <span class="font-medium">{{ row.quantity }} EA</span>
          </template>

          <template #cell-worker="{ row }">
            <span>{{ row.worker }}</span>
          </template>

          <template #cell-inboundDate="{ row }">
            <span>{{ row.inboundDate }}</span>
          </template>

          <template #cell-outboundDate="{ row }">
            <span v-if="row.outboundDate">{{ row.outboundDate }}</span>
            <span v-else class="text-zinc-400">-</span>
          </template>

          <template #cell-status="{ row }">
                        <span :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            row.status === '보관중'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        ]">
                            {{ row.status }}
                        </span>
          </template>
        </TableComp>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { formatWon } from '@/utils/format.js'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import TableComp from '@/components/common/TableComp.vue'

// 상품 정보
const product = {
  code: 'PRD-1001',
  name: '무선 마우스',
  totalQuantity: 85,
  unitPrice: 25000,
  totalAmount: 2125000,
  vendor: '테크 서플라이',
}

// 재고 목록 컬럼
const inventoryColumns = [
  { key: 'lotNumber', label: '로트 번호' },
  { key: 'center', label: '물류센터' },
  { key: 'location', label: '보관 위치' },
  { key: 'quantity', label: '수량' },
  { key: 'worker', label: '적치 작업자' },
  { key: 'inboundDate', label: '입고일' },
  { key: 'outboundDate', label: '출고일' },
  { key: 'status', label: '상태' },
]

// 재고 상세 목록 (같은 상품이지만 로트/위치가 다른 케이스)
const inventoryList = [
  {
    lotNumber: 'LOT-2025-001',
    center: '서울 물류센터',
    location: 'A-12',
    quantity: 35,
    worker: '김현수',
    inboundDate: '2025-10-10',
    outboundDate: null,
    status: '보관중',
  },
  {
    lotNumber: 'LOT-2025-002',
    center: '서울 물류센터',
    location: 'A-15',
    quantity: 28,
    worker: '이지은',
    inboundDate: '2025-10-12',
    outboundDate: null,
    status: '보관중',
  },
  {
    lotNumber: 'LOT-2025-003',
    center: '부산 물류센터',
    location: 'B-07',
    quantity: 22,
    worker: '박민수',
    inboundDate: '2025-10-08',
    outboundDate: null,
    status: '보관중',
  },
]
</script>