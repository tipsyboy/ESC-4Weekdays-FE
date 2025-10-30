<template>
  <AppPageLayout>
    <!-- 상단 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
            {{ state.productList.productName }}
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            상품 코드: {{ state.productList.productCode }}
          </p>
        </div>

        <div class="flex gap-2">
          <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">뒤로가기</ButtonComp>
          <ButtonComp color="secondary" icon="edit">수정</ButtonComp>
          <ButtonComp color="secondary" icon="print">인쇄</ButtonComp>
        </div>
      </div>
    </template>

    <!-- 본문 -->
    <section class="space-y-8">
      <!-- 상품 정보 -->
      <div
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6 backdrop-blur-sm"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">상품 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <!-- 상품 코드 -->
          <div>
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">상품 코드</span>
              {{ state.productList.productCode }}
          </div>

          <!-- 상품 이름 -->
          <div>
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">상품 이름</span>
            <span class="text-sm font-medium">{{ state.productList.productName }}</span>
          </div>

          <!-- 총 재고 수량 -->
          <div>
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">총 재고 수량</span>
            <span class="text-sm font-medium">{{ state.productList.totalQuantity }} EA</span>
          </div>

          <!-- 단가 -->
          <div>
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">단가</span>
            <span class="text-sm font-medium">{{ formatWon(state.productList.unitPrice) }}</span>
          </div>

          <!-- 총 금액 -->
          <div>
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">총 금액</span>
            <span class="text-sm font-medium">{{ formatWon(state.productList.totalPrice) }}</span>
          </div>

          <!-- 공급 업체 -->
          <div>
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">공급 업체</span>
            <span class="text-sm font-medium">{{ state.productList.vendorName }}</span>
          </div>
        </div>
      </div>

      <!-- 재고 상세 목록 -->
      <div
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6 backdrop-blur-sm"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">재고 상세 목록</h2>

        <TableComp :columns="inventoryColumns" :data="state.productList.inventories">
          <template #cell-lotNumber="{ row }">
            <span class="font-medium text-slate-900 dark:text-white">{{ row.lotNumber }}</span>
          </template>

          <template #cell-locationCode="{ row }">
            <span>{{ row.locationCode }}</span>
          </template>

          <template #cell-quantity="{ row }">
            <span class="font-medium">{{ row.quantity }} EA</span>
          </template>

          <template #cell-inboundCode="{ row }">
            <span>{{ row.inboundCode || '-' }}</span>
          </template>

          <template #cell-createdAt="{ row }">
            <span>{{ formatDate(row.createdAt) }}</span>
          </template>
        </TableComp>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { formatWon } from '@/utils/format.js'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import InventoryApi from '@/api/inventory/index.js'

const route = useRoute()
const productCode = route.params.productCode

const state = reactive({
  productList: {},
})

onMounted(async () => {
  await fetchInventoryDetail()
})

const fetchInventoryDetail = async () => {
    await InventoryApi.getProductInventoryDetail(productCode)
      .then((response) =>{
        state.productList = response
      })
      .catch((error) => {
        console.error(error)
      })
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

const inventoryColumns = [
  { key: 'lotNumber', label: '로트 번호' },
  { key: 'locationCode', label: '보관 위치' },
  { key: 'quantity', label: '수량' },
  { key: 'inboundCode', label: '입고 코드' },
  { key: 'createdAt', label: '입고일' },
]
</script>
