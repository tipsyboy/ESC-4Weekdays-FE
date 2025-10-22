<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">발주 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">발주 내역을 조회하고 관리합니다</p>
        </div>

        <div class="flex items-center gap-3">
          <RouterLink to="/purchase/create" class="w-40">
            <ButtonComp color="primary" icon="add">신규 발주</ButtonComp>
          </RouterLink>

          <SearchBarComp
            v-model="query"
            placeholder="발주서 검색..."
            @search="handleSearch"
          />
        </div>
      </div>
    </template>

    <div class="flex flex-wrap items-center gap-3 mb-8">
      <button
        v-for="filter in filters"
        :key="filter"
        class="flex items-center gap-2 rounded border border-zinc-300 dark:border-zinc-700
               bg-background-light dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700
               dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <span>{{ filter }}</span>
        <span class="material-symbols-outlined text-base">expand_more</span>
      </button>
    </div>

    <TableComp :columns="columns" :data="filteredOrders">
      <template #cell-orderNumber="{ row }">
        <RouterLink :to="`/purchase/${row.id}`">
          <span class="text-primary font-semibold hover:underline">
            {{ row.orderNumber }}
          </span>
        </RouterLink>
      </template>

      <!-- 공급업체 -->
      <template #cell-vendorName="{ row }">
        <span class="text-slate-800 dark:text-slate-200">{{ row.vendorName }}</span>
      </template>

      <!-- 상태 -->
      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
      </template>

      <!-- 금액 -->
      <template #cell-totalAmount="{ row }">
        {{ formatWon(row.totalAmount) }}
      </template>

      <!-- 발주일 -->
      <template #cell-orderDate="{ row }">
        {{ formatDate(row.orderDate) }}
      </template>

      <!-- 입고예정일 -->
      <template #cell-expectedDate="{ row }">
        {{ formatDate(row.expectedDate) }}
      </template>
    </TableComp>
  </AppPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/api/purchase'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import { formatDate, formatWon } from '@/utils/format.js'
import { getStatusLabel, getStatusColor } from '@/utils/statusMapper.js'

const filters = ['기간', '공급업체', '상태']

const list = ref([])
const query = ref('')

const columns = [
  { key: 'orderNumber', label: '발주 번호' },
  { key: 'vendorName', label: '공급 업체' },
  { key: 'status', label: '상태', align: 'center' },
  { key: 'totalAmount', label: '총 금액', align: 'right' },
  { key: 'orderDate', label: '발주일' },
  { key: 'expectedDate', label: '입고 예정일' },
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
</script>
