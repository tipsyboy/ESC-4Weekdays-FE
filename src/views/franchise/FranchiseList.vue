<template>
  <AppPageLayout>
    <!-- 상단 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">가맹점 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            가맹점을 조회하고 관리합니다
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- 신규 가맹점 등록 -->
          <RouterLink to="/franchise/create" class="w-40">
            <ButtonComp color="primary" icon="add" class="whitespace-nowrap">신규 가맹점</ButtonComp>
          </RouterLink>

          <!-- 검색창 -->
          <SearchBarComp
              v-model="query"
              placeholder="가맹점명 또는 코드 검색..."
              @search="handleSearch"
          />
        </div>
      </div>
    </template>

    <!-- 데이터 테이블 -->
    <TableComp :columns="columns" :data="filteredFranchises">
      <!-- 가맹점코드 -->
      <template #cell-franchiseCode="{ row }">
        <RouterLink
            :to="{ name: 'franchiseDetail', params: { id: row.id } }"
            class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {{ row.franchiseCode }}
        </RouterLink>
      </template>

      <!-- 상태 -->
      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)"/>
      </template>

      <!-- 주소 -->
      <template #cell-address="{ row }">
        {{ row.address?.street || '-' }}
      </template>

      <!-- 등록일 -->
      <template #cell-createdAt="{ row }">
        {{ formatDate(row.createdAt) }}
      </template>
    </TableComp>
  </AppPageLayout>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import franchiseApi from "@/api/franchise/index.js";
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

const franchises = ref([])
const query = ref('')

// ✅ 테이블 컬럼 정의
const columns = [
  {key: 'franchiseCode', label: '가맹점 코드', width: '12%'},
  {key: 'name', label: '가맹점명'},
  {key: 'phoneNumber', label: '연락처'},
  {key: 'email', label: '이메일'},
  {key: 'address', label: '주소'}, // street만 표시
  {key: 'status', label: '상태', align: 'center'},
  {key: 'createdAt', label: '등록일'},
]

// import 사용해서 불러오는 방식! 기억을 상기시켜 보시기 바람니다!
const fetchFranchises = async () => {
  try {
    const res = await franchiseApi.franchiseReadAll(0, 10);
    franchises.value = res.results.content || []
  } catch (e) {
    console.error("가맹점 목록 조회 실패:", e)
  }
}

// 검색 필터
const filteredFranchises = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return franchises.value
  return franchises.value.filter((f) =>
      [f.franchiseCode, f.name, f.email].some((field) => field?.toLowerCase().includes(q))
  )
})

const handleSearch = (val) => {
  query.value = val ?? ''
}

onMounted(fetchFranchises)
</script>
