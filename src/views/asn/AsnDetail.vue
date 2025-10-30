<template>
  <AppPageLayout>
    <!-- 헤더 -->
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">ASN 상세</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            ASN 상세 내역을 확인합니다.
          </p>
        </div>

        <ButtonComp color="secondary" icon="arrow_back" @click="router.back()">
          뒤로가기
        </ButtonComp>
      </div>
    </template>

    <!-- 기본 정보 카드 -->
    <div class="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-8 shadow-sm">
      <h2 class="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">기본 정보</h2>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 text-sm text-gray-700 dark:text-gray-200">
        <div>
          <p class="font-medium text-gray-500 dark:text-gray-400">ASN 코드</p>
          <p class="mt-1">{{ asn?.asnCode || '-' }}</p>
        </div>

        <div>
          <p class="font-medium text-gray-500 dark:text-gray-400">거래처명</p>
          <p class="mt-1">{{ asn?.vendorName || '-' }}</p>
        </div>

        <div>
          <p class="font-medium text-gray-500 dark:text-gray-400">발주 코드</p>
          <p class="mt-1">{{ asn?.purchaseOrderCode || '-' }}</p>
        </div>

        <div>
          <p class="font-medium text-gray-500 dark:text-gray-400">입고 예정일</p>
          <p class="mt-1">{{ formatDate(asn?.expectedDate) }}</p>
        </div>

        <div>
          <p class="font-medium text-gray-500 dark:text-gray-400">상태</p>
          <p class="mt-1">
            <BadgeComp
              :color="asn?.expectedDate ? 'info' : 'danger'"
              :label="asn?.expectedDate ? '승인' : '거절'"
            />
          </p>
        </div>

        <div class="col-span-2 md:col-span-3">
          <p class="font-medium text-gray-500 dark:text-gray-400">비고</p>
          <p class="mt-1">{{ asn?.description || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- 상품 목록 -->
    <div class="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
      <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">상품 목록</h2>

      <TableComp
        :columns="productColumns"
        :data="asn?.products || []"
        class="mt-4"
      />
    </div>
  </AppPageLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import TableComp from '@/components/common/TableComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import api from '@/api/asn'

const route = useRoute()
const router = useRouter()
const asn = ref(null)

const productColumns = [
  { key: 'productName', label: '상품명' },
  { key: 'unitPrice', label: '단가' },
  { key: 'orderedQuantity', label: '수량' },
  { key: 'description', label: '비고' },
]

const fetchAsnDetail = async () => {
  const id = route.params.id
  const res = await api.getAsnDetail(id)
  asn.value = res?.results || null
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

onMounted(fetchAsnDetail)
</script>
