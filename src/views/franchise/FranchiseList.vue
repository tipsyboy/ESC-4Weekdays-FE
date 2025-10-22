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
            :to="{name:'franchiseDetail', params:{id: row.id}}"
            class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {{ row.franchiseCode }}
        </RouterLink>
      </template>

      <!-- 상태 -->
      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)"/>
      </template>

      <!-- 등록일 포맷 -->
      <template #cell-createdAt="{ row }">
        {{ formatDate(row.createdAt) }}
      </template>
    </TableComp>
  </AppPageLayout>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
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
const franchises = ref([])
const query = ref('')

// ✅ 더미 데이터 (API 실패 시 대체)
const dummyFranchises = [
  {
    id: 1,
    franchiseCode: 'FR-2025001',
    name: '올리브뷰티 강남점',
    phoneNumber: '02-567-1234',
    email: 'gangnam@olivebeauty.co.kr',
    status: 'ACTIVE',
    productCount: 124,
    createdAt: '2025-01-12T10:30:00Z',
  },
  {
    id: 2,
    franchiseCode: 'FR-2025002',
    name: '올리브뷰티 홍대점',
    phoneNumber: '02-324-5678',
    email: 'hongdae@olivebeauty.co.kr',
    status: 'ACTIVE',
    productCount: 98,
    createdAt: '2025-02-03T14:20:00Z',
  },
  {
    id: 3,
    franchiseCode: 'FR-2025003',
    name: '올리브뷰티 부산서면점',
    phoneNumber: '051-802-3344',
    email: 'busan@olivebeauty.co.kr',
    status: 'INACTIVE',
    productCount: 85,
    createdAt: '2025-03-08T09:45:00Z',
  },
  {
    id: 4,
    franchiseCode: 'FR-2025004',
    name: '올리브뷰티 대구중앙점',
    phoneNumber: '053-422-7788',
    email: 'daegu@olivebeauty.co.kr',
    status: 'ACTIVE',
    productCount: 110,
    createdAt: '2025-03-25T16:10:00Z',
  },
  {
    id: 5,
    franchiseCode: 'FR-2025005',
    name: '올리브뷰티 광주상무점',
    phoneNumber: '062-381-5599',
    email: 'gwangju@olivebeauty.co.kr',
    status: 'SUSPENDED',
    productCount: 60,
    createdAt: '2025-04-15T13:00:00Z',
  },
]

// 테이블 컬럼 정의
const columns = [
  {key: 'franchiseCode', label: '가맹점 코드', width: '10%'},
  {key: 'name', label: '가맹점명'},
  {key: 'phoneNumber', label: '연락처'},
  {key: 'email', label: '이메일'},
  {key: 'status', label: '상태', align: 'center'},
  {key: 'productCount', label: '상품 수', align: 'center'},
  {key: 'createdAt', label: '등록일'},
]

// ✅ axios로 franchise 목록 불러오기
const fetchFranchises = async () => {
  try {
    const res = await axios.get('/api/franchises/list', {params: {page: 0, size: 20}})
    franchises.value = res.data?.results?.content || dummyFranchises
  } catch (err) {
    console.error('❌ 가맹점 목록 조회 실패:', err)
    franchises.value = dummyFranchises
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
