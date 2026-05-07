<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Vendor ASN Detail</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{{ asn?.asnNumber || 'ASN 상세' }}</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {{ asn?.purchaseOrderNumber || '-' }} · {{ statusMeta(asn?.status).label }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="router.push(`/vendor-portal/purchase-requests/${route.params.id}`)">발주 요청 상세로</ButtonComp>
        </div>
      </div>
    </template>

    <section
      v-if="isLoading"
      class="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
    >
      ASN 정보를 불러오는 중입니다.
    </section>

    <section
      v-else-if="errorMessage && !asn"
      class="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-sm text-rose-700 shadow-sm dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
    >
      {{ errorMessage }}
    </section>

    <section v-else-if="asn" class="space-y-6">
      <section class="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <article
          v-for="card in summaryCards"
          :key="card.title"
          class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ card.title }}</div>
          <div class="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50">{{ card.value }}</div>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ card.description }}</p>
        </article>
      </section>

      <section class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">발주 / 회신 기본 정보</h2>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div class="info-card">
              <div class="info-label">발주번호</div>
              <div class="info-value">{{ asn.purchaseOrderNumber }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">공급업체</div>
              <div class="info-value">{{ asn.vendorName }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">도착 예정 일시</div>
              <div class="info-value">{{ asn.status === 'REJECTED' ? '-' : formatDateTime(asn.expectedArrivalAt) }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">차량 정보</div>
              <div class="info-value">{{ asn.status === 'REJECTED' ? '-' : (asn.vehicleInfo || '-') }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">담당자</div>
              <div class="info-value">{{ asn.contactName || '-' }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">출하 담당자 연락처</div>
              <div class="info-value">{{ asn.contactPhoneNumber || asn.vendorPhoneNumber || '-' }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">현재 상태</div>
              <div class="mt-2">
                <BadgeComp :color="statusMeta(asn.status).color" :label="statusMeta(asn.status).label" />
              </div>
            </div>
            <div class="info-card md:col-span-2">
              <div class="info-label">메모</div>
              <div class="info-value">{{ asn.note || '-' }}</div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">회신 요약</h2>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6">
            <div class="info-card">
              <div class="info-label">회신 총수량 / 요청 총수량</div>
              <div class="info-value">{{ asn.status === 'REJECTED' ? '회신불가' : `${totalAnnouncedQuantity}개 / ${totalRequestedQuantity}개` }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">회신 품목 수</div>
              <div class="info-value">{{ asn.status === 'REJECTED' ? '-' : `${asn.items?.length || 0}종` }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">회신 상태 요약</div>
              <div class="info-value">{{ replySummaryLabel }}</div>
            </div>
          </div>
        </article>
      </section>

      <article
        v-if="asn.status !== 'REJECTED'"
        class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">품목별 회신 내역</h2>
        </div>

        <div class="overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th class="px-6 py-4 text-left font-medium">상품명</th>
                <th class="px-6 py-4 text-left font-medium">상품코드</th>
                <th class="px-6 py-4 text-left font-medium">회신 수량</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in asn.items || []"
                :key="item.productCode"
                class="border-t border-slate-100 dark:border-slate-800"
              >
                <td class="px-6 py-5 font-medium text-slate-900 dark:text-slate-50">{{ item.productName }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ item.productCode }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ item.announcedQuantity }}개</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import purchaseOrderApi from '@/api/purchaseorder/purchaseOrderApi.js'
import asnApi from '@/api/asn/asnApi.js'

const route = useRoute()
const router = useRouter()

const purchaseOrder = ref(null)
const asn = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const statusMeta = (status) => {
  const map = {
    WAITING: { label: '대기', color: 'info' },
    RECEIVED: { label: '확인', color: 'warning' },
    REJECTED: { label: '회신불가', color: 'danger' },
    SCHEDULED: { label: '입고예정', color: 'success' },
  }

  return map[status] || map.WAITING
}

const totalRequestedQuantity = computed(() => purchaseOrder.value?.totalQuantity || 0)
const totalAnnouncedQuantity = computed(() =>
  (asn.value?.items || []).reduce((sum, item) => sum + (item.announcedQuantity || 0), 0),
)

const replySummaryLabel = computed(() => {
  if (!asn.value) {
    return '-'
  }

  return asn.value.status === 'REJECTED' ? '회신불가' : '회신완료'
})

const summaryCards = computed(() => [
  {
    title: 'ASN 번호',
    value: asn.value?.asnNumber || '-',
    description: '공급업체가 회신한 ASN 번호',
  },
  {
    title: '회신 총수량',
    value: asn.value?.status === 'REJECTED' ? '-' : `${totalAnnouncedQuantity.value}개`,
    description: '회신된 전체 수량',
  },
  {
    title: '요청 총수량',
    value: `${totalRequestedQuantity.value}개`,
    description: '발주서 기준 전체 요청 수량',
  },
  {
    title: '회신 상태',
    value: replySummaryLabel.value,
    description: '요청 대비 회신 진행 상태',
  },
])

const formatDateTime = (value) => {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadPage = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const [purchaseOrderRes, asnRes] = await Promise.all([
    purchaseOrderApi.getPurchaseOrderDetail(route.params.id),
    asnApi.getAsnByPurchaseOrderId(route.params.id),
  ])

  if (!purchaseOrderRes.success) {
    errorMessage.value = purchaseOrderRes.message || '발주 요청 상세 조회에 실패했습니다.'
    isLoading.value = false
    return
  }

  if (!asnRes.success) {
    purchaseOrder.value = purchaseOrderRes.results
    errorMessage.value = asnRes.message || 'ASN 조회에 실패했습니다.'
    isLoading.value = false
    return
  }

  purchaseOrder.value = purchaseOrderRes.results
  asn.value = asnRes.results || null

  if (!asn.value) {
    errorMessage.value = '연결된 ASN이 없습니다.'
  }

  isLoading.value = false
}

onMounted(loadPage)
</script>

<style scoped>
.info-card {
  @apply rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950;
}

.info-label {
  @apply text-sm font-medium text-slate-500 dark:text-slate-400;
}

.info-value {
  @apply mt-2 text-base font-semibold text-slate-900 dark:text-slate-50;
}
</style>
