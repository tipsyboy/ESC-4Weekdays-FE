<template>
  <AppPageLayout>
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="text-2xl font-semibold">재고 관리</h1>
          <p class="text-gray-500 text-sm mt-1">
            현재 보유 중인 상품 재고 내역을 확인할 수 있습니다.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <RouterLink to="/stock/create" class="w-40">
            <ButtonComp color="primary" icon="add">신규 재고</ButtonComp>
          </RouterLink>

          <SearchBarComp v-model="searchQuery" placeholder="재고 검색..." />
        </div>
      </div>
    </template>

    <!-- 필터 버튼 영역 -->
    <div class="flex flex-wrap items-center gap-3 mb-8">
      <button
        v-for="filter in filters"
        :key="filter"
        class="flex items-center gap-2 rounded border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <span>{{ filter }}</span>
        <span class="material-symbols-outlined text-base">expand_more</span>
      </button>

      <!-- ✅ 기간 필터 -->
      <div class="flex items-center gap-2 text-sm">
        <label class="text-zinc-700 dark:text-zinc-300">입고일</label>
        <input
          type="date"
          v-model="filterStartDate"
          class="border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-1 bg-background-light dark:bg-zinc-900 focus:ring-1 focus:ring-primary/50 outline-none"
        />
        <span class="text-zinc-500">~</span>
        <input
          type="date"
          v-model="filterEndDate"
          class="border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-1 bg-background-light dark:bg-zinc-900 focus:ring-1 focus:ring-primary/50 outline-none"
        />
      </div>
    </div>

    <!-- 데이터 테이블 -->
    <TableComp :columns="columns" :data="state.inventories">
      <template #cell-productCode="{ row }">
        <RouterLink
          v-if="row.productCode"
          :to="`/product/detail/${row.productCode}`"
          class="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          {{ row.productCode }}
        </RouterLink>
        <span v-else class="text-zinc-400">-</span>
      </template>

      <template #cell-productName="{ row }">
        <span>{{ row.productName }}</span>
      </template>

      <template #cell-totalQuantity="{ row }">
        <span class="font-medium">{{ row.totalQuantity }}</span>
      </template>

      <template #cell-vendor="{ row }">
        <span>{{ row.vendorName }}</span>
      </template>
    </TableComp>
  </AppPageLayout>
</template>

<script setup>
import ButtonComp from '@/components/common/ButtonComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import InventoryApi from '@/api/inventory/index.js'
import InventorySearchRequest from '@/entity/inventory/InventorySearchRequest.js'

const filters = ['카테고리', '보관 위치', '수량 상태', '물류센터']

const columns = [
  { key: 'productCode', label: '상품 코드' },
  { key: 'productName', label: '상품명' },
  { key: 'totalQuantity', label: '총 수량' },
  { key: 'vendor', label: '공급 업체' },
]
const state = reactive({
  inventories: []
})

const form = reactive({
  inventorySearchRequest: new InventorySearchRequest(),
})

const searchQuery = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')

onMounted(() => {
  InventoryApi.getInventorySummaryForList(0, 10, form.inventorySearchRequest)
    .then((response) => {
      state.inventories = response.results.content
    })
    .catch((error) => {
      console.error(error)
    })
})

const filteredStock = computed(() => {
  return stockData.value.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    const inbound = new Date(item.inboundDate)
    const start = filterStartDate.value ? new Date(filterStartDate.value) : null
    const end = filterEndDate.value ? new Date(filterEndDate.value) : null

    const dateMatch = (!start || inbound >= start) && (!end || inbound <= end)

    return nameMatch && dateMatch
  })
})
</script>