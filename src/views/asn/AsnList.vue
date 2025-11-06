<template>
  <AppPageLayout>
    <!-- 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">ASN 목록</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            공급사로부터 발송된 ASN 목록을 조회합니다.
          </p>
        </div>

        <SearchBarComp
          v-model="query"
          placeholder="ASN 코드 또는 발주 코드 검색"
          @search="handleSearch"
        />
      </div>
    </template>

    <!-- ASN 목록 테이블 -->
    <TableComp :columns="columns" :data="pagedAsns">
      <!-- ASN 코드 -->
      <template #cell-asnCode="{ row }">
        <RouterLink
          :to="`/asn/${row.id}`"
          class="text-primary font-semibold hover:underline"
        >
          {{ row.asnCode }}
        </RouterLink>
      </template>

      <!-- 발주 코드 -->
      <template #cell-purchaseOrderCode="{ row }">
        {{ row.purchaseOrderCode || '-' }}
      </template>

      <!-- 입고 예정일 -->
      <template #cell-expectedDate="{ row }">
        {{ row.expectedDate ? formatDate(row.expectedDate) : '-' }}
      </template>

      <!-- 상태 -->
      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
      </template>
    </TableComp>

    <!-- 페이지네이션 -->
    <div class="flex justify-center items-center gap-2 mt-8">
      <ButtonComp
        color="secondary"
        icon="arrow_back"
        :disabled="page === 0"
        @click="changePage(page - 1)"
      />
      <span class="text-sm text-slate-600 whitespace-nowrap">
        페이지 {{ page + 1 }} / {{ totalPages }}
      </span>
      <ButtonComp
        color="secondary"
        icon="arrow_forward"
        :disabled="page >= totalPages - 1"
        @click="changePage(page + 1)"
      />
    </div>
  </AppPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import TableComp from '@/components/common/TableComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import api from '@/api/asn'

// ---------------------------
// 상태 변수
// ---------------------------
const asns = ref([])
const query = ref('')
const page = ref(0)
const pageSize = 10
const total = ref(0)

// ---------------------------
// 컬럼 정의
// ---------------------------
const columns = [
  { key: 'asnCode', label: 'ASN 코드' },
  { key: 'purchaseOrderCode', label: '발주 코드' },
  { key: 'expectedDate', label: '입고 예정일' },
  { key: 'status', label: '상태' },
]

// ---------------------------
// 데이터 페이징
// ---------------------------
const totalPages = computed(() => Math.ceil(total.value / pageSize))
const pagedAsns = computed(() => asns.value)

// ---------------------------
// 데이터 로드
// ---------------------------
const fetchAsnList = async () => {
  const res = await api.getAsnList(page.value, pageSize)
  const list = res?.results?.content || []
  total.value = res?.results?.totalElements || 0

  asns.value = list.map((item) => ({
    id: item.id,
    asnCode: item.asnCode,
    purchaseOrderCode: item.purchaseOrderCode || '-',
    expectedDate: item.expectedDate,
    status: item.expectedDate ? 'ACCEPTED' : 'REJECTED', // 예상일 없는건 거절 처리
  }))
}

const handleSearch = () => {
  if (!query.value) return fetchAsnList()
  const q = query.value.toLowerCase()
  asns.value = asns.value.filter(
    (i) =>
      i.asnCode.toLowerCase().includes(q) ||
      i.purchaseOrderCode.toLowerCase().includes(q)
  )
}

const changePage = (newPage) => {
  if (newPage < 0 || newPage >= totalPages.value) return
  page.value = newPage
  fetchAsnList()
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const getStatusColor = (status) => {
  switch (status) {
    case 'ACCEPTED':
      return 'info'
    case 'REJECTED':
      return 'danger'
    default:
      return 'gray'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'ACCEPTED':
      return '승인'
    case 'REJECTED':
      return '거절'
    default:
      return '미정'
  }
}

onMounted(fetchAsnList)
</script>
