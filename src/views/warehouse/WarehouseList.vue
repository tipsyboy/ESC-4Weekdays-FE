<template>
  <AppPageLayout>
    <!-- 상단 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">물류창고 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            물류창고를 조회하고 관리합니다
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- 신규 등록 -->
          <RouterLink to="/warehouse/create" class="w-40">
            <ButtonComp color="primary" icon="add" class="whitespace-nowrap">신규 창고</ButtonComp>
          </RouterLink>

          <!-- 검색창 -->
          <SearchBarComp
              v-model="query"
              placeholder="창고명 또는 이메일 검색..."
              @search="handleSearch"
          />
        </div>
      </div>
    </template>

    <!-- 데이터 테이블 -->
    <TableComp :columns="columns" :data="filteredWarehouses">
      <!-- 창고명 클릭 시 상세로 이동 -->
      <template #cell-name="{ row }">
        <RouterLink
            :to="{ name: 'warehouseDetail', params: { id: row.id } }"
            class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {{ row.name }}
        </RouterLink>
      </template>

      <!-- 주소 -->
      <template #cell-address="{ row }">
        {{ row.address?.street || '-' }}
      </template>
    </TableComp>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import warehouseApi from '@/api/warehouse/index.js'

// ✅ 테이블 컬럼 정의 (id 제거)
const columns = [
  { key: 'name', label: '창고명' },
  { key: 'phoneNumber', label: '연락처' },
  { key: 'email', label: '이메일' },
  { key: 'address', label: '주소' },
]

const warehouses = ref([])
const query = ref('')

// ✅ 데이터 조회
const fetchWarehouses = async () => {
  try {
    const res = await warehouseApi.warehouseReadAll(0, 10)
    warehouses.value = res.results.content || []
  } catch (e) {
    console.error('물류창고 목록 조회 실패:', e)
  }
}

// ✅ 검색 필터
const filteredWarehouses = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return warehouses.value
  return warehouses.value.filter((w) =>
      [w.name, w.email, w.phoneNumber].some((field) =>
          field?.toLowerCase().includes(q)
      )
  )
})

const handleSearch = (val) => {
  query.value = val ?? ''
}

onMounted(fetchWarehouses)
</script>
