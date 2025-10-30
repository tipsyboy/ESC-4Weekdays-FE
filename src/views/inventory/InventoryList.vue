<template>
  <AppPageLayout>
    <!-- 페이지 헤더 -->
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="text-2xl font-semibold">재고 관리</h1>
          <p class="text-gray-500 text-sm mt-1">
            현재 보유 중인 상품 재고 내역을 확인할 수 있습니다.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!--          <RouterLink to="/stock/create" class="w-40">-->
          <!--            <ButtonComp color="primary" icon="add">신규 재고</ButtonComp>-->
          <!--          </RouterLink>-->
          <SearchBarComp placeholder="재고 검색..." />
        </div>
      </div>
    </template>

    <!-- 필터 버튼 영역 -->
    <div class="flex flex-wrap items-center gap-3 mb-8">
      <button
        v-for="filter in state.filters"
        :key="filter"
        class="flex items-center gap-2 rounded border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <span>{{ filter }}</span>
        <span class="material-symbols-outlined text-base">expand_more</span>
      </button>

      <!-- 기간 필터 -->
      <div class="flex items-center gap-2 text-sm">
        <label class="text-zinc-700 dark:text-zinc-300">입고일</label>
        <input
          type="date"
          class="border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-1 bg-background-light dark:bg-zinc-900 focus:ring-1 focus:ring-primary/50 outline-none"
        />
        <span class="text-zinc-500">~</span>
        <input
          type="date"
          class="border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-1 bg-background-light dark:bg-zinc-900 focus:ring-1 focus:ring-primary/50 outline-none"
        />
      </div>
    </div>

    <!-- 상품 리트스 -->
    <ExpandableTable
      :columns="state.mainColumns"
      :rows="state.inventories"
      :sub-columns="state.subColumns"
      :expanded-ids="expandedIds"
      sub-key="inventories"
      @toggle-expand="toggleExpand"
    >
      <template #sub-row="{ subItem }">
        <td class="px-6 py-3 text-sm">{{ subItem.locationCode }}</td>
        <td class="px-6 py-3 text-sm">{{ subItem.lotNumber }}</td>
        <td class="px-6 py-3 text-sm text-right font-medium">{{ subItem.quantity }}</td>
        <td class="px-6 py-3 text-sm">{{ subItem.inboundCode || '-' }}</td>
        <td class="px-6 py-3 text-sm">
          {{ new Date(subItem.createdAt).toLocaleDateString('ko-KR') }}
        </td>
      </template>
    </ExpandableTable>
  </AppPageLayout>
</template>

<script setup>
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import { onMounted, reactive, ref } from 'vue'
import InventoryApi from '@/api/inventory/index.js'
import InventorySearchRequest from '@/entity/inventory/InventorySearchRequest.js'
import ExpandableTable from '@/components/common/ExpandableTable.vue'

const form = reactive({
  inventorySearchRequest: new InventorySearchRequest(),
})
const state = reactive({
  inventories: [],

  filters: ['카테고리', '보관 위치', '수량 상태', '물류센터'],

  mainColumns: [
    { key: 'productCode', label: '상품 코드' },
    { key: 'productName', label: '상품명' },
    { key: 'totalQuantity', label: '총 수량' },
    { key: 'vendorName', label: '공급 업체' },
  ],

  subColumns: [
    { key: 'locationCode', label: '보관 위치' },
    { key: 'lotNumber', label: 'LOT 번호' },
    { key: 'quantity', label: '수량', align: 'right' },
    { key: 'inboundCode', label: '입고 코드' },
    { key: 'createdAt', label: '입고일' },
  ],
})

onMounted(() => {
  fetchInventoryListByProduct()
})

const fetchInventoryListByProduct = () => {
  InventoryApi.getProductInventoryList(0, 10, form.inventorySearchRequest)
    .then((response) => {
      // console.log(response)
      state.inventories = response.results.content
    })
    .catch((error) => {
      console.error(error)
    })
}

const expandedIds = ref(new Set())

const toggleExpand = (productId) => {
  if (expandedIds.value.has(productId)) {
    expandedIds.value.delete(productId)
  } else {
    expandedIds.value.add(productId)
  }
}
</script>