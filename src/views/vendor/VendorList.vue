<template>
  <AppPageLayout>
    <!-- 상단 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">외부 업체 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">외부 협력업체를 조회하고 관리합니다</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- 신규 업체 등록 -->
          <RouterLink to="/vendor/create" class="w-40">
            <ButtonComp color="primary" icon="add">신규 업체</ButtonComp>
          </RouterLink>

          <!-- 검색창 -->
          <SearchBarComp v-model="query" placeholder="업체명 또는 코드 검색..." @search="handleSearch" />
        </div>
      </div>
    </template>

    <!-- 데이터 테이블 -->
    <TableComp :columns="columns" :data="filteredVendors">
      <!-- 업체코드 -->
      <template #cell-vendorCode="{ row }">
        <RouterLink :to="`/vendor/${row.id}`" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          {{ row.vendorCode }}
        </RouterLink>
      </template>

      <!-- 상태 -->
      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
      </template>

      <!-- 등록일 포맷 -->
      <template #cell-createdAt="{ row }">
        {{ formatDate(row.createdAt) }}
      </template>
    </TableComp>
  </AppPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'

// 상태 표시 유틸
const getStatusLabel = (status) => {
  const map = {
    ACTIVE: '활성',
    INACTIVE: '비활성',
    SUSPENDED: '거래중단',
  }
  return map[status] || '-'
}

const getStatusColor = (status) => {
  const map = {
    ACTIVE: 'success',
    INACTIVE: 'warning',
    SUSPENDED: 'danger',
  }
  return map[status] || 'gray'
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

const router = useRouter()
const vendors = ref([])
const query = ref('')

const columns = [
  { key: 'vendorCode', label: '업체 코드', width: '10%' },
  { key: 'name', label: '업체명' },
  { key: 'phoneNumber', label: '연락처' },
  { key: 'email', label: '이메일' },
  { key: 'status', label: '상태', align: 'center' },
  { key: 'productCount', label: '상품 수', align: 'center' },
  { key: 'createdAt', label: '등록일' },
]

// ✅ axios로 vendor 목록 불러오기
const fetchVendors = async () => {
  try {
    const res = await axios.get('/api/vendors/list', { params: { page: 0, size: 20 } })
    vendors.value = res.data?.results?.content || []
  } catch (err) {
    console.error('❌ Vendor 목록 조회 실패:', err)
  }
}

// 검색 필터
const filteredVendors = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return vendors.value
  return vendors.value.filter((v) =>
    [v.vendorCode, v.name, v.email].some((f) => f?.toLowerCase().includes(q))
  )
})

const handleSearch = (val) => {
  query.value = val ?? ''
}

onMounted(fetchVendors)
</script>
