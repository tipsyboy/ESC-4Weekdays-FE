<template>
  <AppPageLayout>
    <!-- 헤더 영역 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">ASN 발송 (Vendor)</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            외부 업체가 발주에 대한 ASN을 발송하거나 거절할 수 있습니다.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <SearchBarComp
            v-model="query"
            placeholder="발주 코드 또는 업체명 검색"
            @search="handleSearch"
          />
        </div>
      </div>
    </template>

    <!-- ASN 목록 테이블 -->
    <TableComp :columns="columns" :data="pagedOrders">
      <template #cell-status="{ row }">
        <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
      </template>

      <template #actions="{ row }">
        <div class="flex gap-2 justify-center">
          <ButtonComp
            color="primary"
            class="px-4 py-1 text-xs font-semibold text-white rounded-md"
            @click="openAsnModal(row, 'ACCEPTED')"
          >
            ASN 발송
          </ButtonComp>
          <ButtonComp
            color="danger"
            class="px-4 py-1 text-xs font-semibold text-white rounded-md"
            @click="openAsnModal(row, 'REJECTED')"
          >
            거절
          </ButtonComp>
        </div>
      </template>
    </TableComp>

    <!-- 페이지네이션 -->
    <div class="flex justify-center items-center gap-2 mt-8">
      <ButtonComp
        color="secondary"
        icon="arrow_back"
        :disabled="page === 0"
        @click="changePage(page - 1)"
      >
        이전
      </ButtonComp>
      <span class="text-sm text-slate-600 whitespace-nowrap">
        페이지 {{ page + 1 }} / {{ totalPages }}
      </span>
      <ButtonComp
        color="secondary"
        icon="arrow_forward"
        :disabled="page >= totalPages - 1"
        @click="changePage(page + 1)"
      >
        다음
      </ButtonComp>
    </div>

    <!-- ASN 발송/거절 모달 -->
    <ModalComp
      :open="asnModalOpen"
      title="ASN 발송 확인"
      icon="local_shipping"
      @close="asnModalOpen = false"
    >
      <div class="p-6 text-center space-y-6">
        <p class="text-gray-700 dark:text-gray-200">
          발주서 <strong>{{ selectedOrder?.code }}</strong> 에 대해
          <strong>{{ asnTypeLabel }}</strong> 하시겠습니까?
        </p>
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <ButtonComp color="secondary" @click="asnModalOpen = false">취소</ButtonComp>
          <ButtonComp color="primary" @click="submitAsn">확인</ButtonComp>
        </div>
      </div>
    </ModalComp>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import TableComp from '@/components/common/TableComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import ModalComp from '@/components/common/ModalComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import api from '@/api/asn'

// -------------------------
// 상태 변수
// -------------------------
const purchaseOrders = ref([])
const query = ref('')
const page = ref(0)
const pageSize = 10
const asnModalOpen = ref(false)
const selectedOrder = ref(null)
const asnType = ref(null)

// -------------------------
// 테이블 컬럼 정의
// -------------------------
const columns = [
  { key: 'code', label: '발주 코드' },
  { key: 'vendorName', label: '업체명' },
  { key: 'status', label: '상태' },
  { key: 'createdAt', label: '등록일' },
]

// -------------------------
// 페이지네이션
// -------------------------
const totalPages = computed(() => Math.ceil(purchaseOrders.value.length / pageSize))
const pagedOrders = computed(() => {
  const start = page.value * pageSize
  return purchaseOrders.value.slice(start, start + pageSize)
})
const changePage = (newPage) => {
  if (newPage < 0 || newPage >= totalPages.value) return
  page.value = newPage
}

// -------------------------
// 임시 데이터 (Mock)
// -------------------------
const mockPurchaseOrders = [
  { id: 1, code: 'PO-2025102901', vendorName: '올리브영 납품업체 A', status: 'REQUESTED', createdAt: '2025-10-29' },
  { id: 2, code: 'PO-2025102902', vendorName: '더페이스샵 공급업체 B', status: 'APPROVED', createdAt: '2025-10-28' },
  { id: 3, code: 'PO-2025102903', vendorName: '토니모리 유통업체 C', status: 'REJECTED', createdAt: '2025-10-27' },
]

// -------------------------
// 데이터 조회 (Mock)
// -------------------------
const fetchPurchaseOrders = async () => {
  purchaseOrders.value = mockPurchaseOrders
}

// -------------------------
// 검색
// -------------------------
const handleSearch = () => {
  if (!query.value) {
    purchaseOrders.value = mockPurchaseOrders
    return
  }

  const q = query.value.toLowerCase()
  purchaseOrders.value = mockPurchaseOrders.filter(
    (item) =>
      item.code.toLowerCase().includes(q) ||
      item.vendorName.toLowerCase().includes(q)
  )
}

// -------------------------
// ASN 모달 제어
// -------------------------
const openAsnModal = (order, type) => {
  selectedOrder.value = order
  asnType.value = type
  asnModalOpen.value = true
}

const asnTypeLabel = computed(() =>
  asnType.value === 'ACCEPTED' ? 'ASN 발송(수락)' : '거절'
)

// -------------------------
// ASN 전송
// -------------------------
const submitAsn = async () => {
  if (!selectedOrder.value) return
  const payload = {
    purchaseOrderId: selectedOrder.value.id,
    status: asnType.value,
  }

  if (asnType.value === 'ACCEPTED') {
    await api.vendorAsnSend(payload)
  } else {
    await api.vendorAsnReject(payload)
  }

  asnModalOpen.value = false
  alert(`ASN ${asnType.value === 'ACCEPTED' ? '발송' : '거절'} 완료!`)
}

// -------------------------
const getStatusColor = (status) => {
  switch (status) {
    case 'REQUESTED': return 'info'
    case 'APPROVED': return 'success'
    case 'REJECTED': return 'danger'
    default: return 'gray'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'REQUESTED': return '요청됨'
    case 'APPROVED': return '승인됨'
    case 'REJECTED': return '거절됨'
    default: return '미정'
  }
}

onMounted(fetchPurchaseOrders)
</script>
