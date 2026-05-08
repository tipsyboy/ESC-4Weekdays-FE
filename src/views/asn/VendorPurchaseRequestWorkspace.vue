<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Vendor Purchase Request</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">
            {{ purchaseOrder?.purchaseOrderNumber || '발주 요청 상세' }}
          </h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {{ purchaseOrder?.vendorName || '-' }} · 발주서 원본 확인
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="router.push('/vendor-portal/purchase-orders')">목록으로</ButtonComp>
          <ButtonComp
            v-if="purchaseOrder && !relatedAsn"
            color="primary"
            icon="arrow_forward"
            @click="goReply"
          >
            ASN 회신 작성
          </ButtonComp>
          <ButtonComp
            v-if="relatedAsn"
            color="secondary"
            icon="visibility"
            @click="goAsnDetail"
          >
            ASN 상세
          </ButtonComp>
        </div>
      </div>
    </template>

    <section
      v-if="isLoading"
      class="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
    >
      발주 요청을 불러오는 중입니다.
    </section>

    <section
      v-else-if="errorMessage && !purchaseOrder"
      class="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-sm text-rose-700 shadow-sm dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
    >
      {{ errorMessage }}
    </section>

    <section v-else-if="purchaseOrder" class="space-y-6">
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

      <section class="grid grid-cols-1 gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <article class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">발주 기본 정보</h2>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div class="detail-card">
              <div class="detail-label">공급업체</div>
              <div class="detail-value">{{ purchaseOrder.vendorName }}</div>
            </div>
            <div class="detail-card">
              <div class="detail-label">요청자</div>
              <div class="detail-value">{{ purchaseOrder.requesterName || '-' }}</div>
            </div>
            <div class="detail-card">
              <div class="detail-label">발주 전달일</div>
              <div class="detail-value">{{ formatDateTime(purchaseOrder.orderedAt || purchaseOrder.updatedAt) }}</div>
            </div>
            <div class="detail-card">
              <div class="detail-label">요청 납기일</div>
              <div class="detail-value">{{ purchaseOrder.expectedInboundDate || '-' }}</div>
            </div>
            <div class="detail-card md:col-span-2">
              <div class="detail-label">메모</div>
              <div class="detail-value">{{ purchaseOrder.requestMemo || '-' }}</div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">회신 상태</h2>
          </div>

          <div class="space-y-4 p-6">
            <div class="detail-card">
              <div class="detail-label">현재 상태</div>
              <div class="mt-2">
                <BadgeComp :color="replyMeta.color" :label="replyMeta.label" />
              </div>
            </div>

            <div class="detail-card">
              <div class="detail-label">연결 ASN</div>
              <div class="detail-value">{{ relatedAsn?.asnNumber || '-' }}</div>
            </div>

            <div class="detail-card">
              <div class="detail-label">예정 도착일</div>
              <div class="detail-value">{{ relatedAsn?.status === 'REJECTED' ? '-' : formatDateTime(relatedAsn?.expectedArrivalAt) }}</div>
            </div>

            <div class="detail-card">
              <div class="detail-label">회신 총수량 / 요청 총수량</div>
              <div class="detail-value">{{ replyQuantitySummary }}</div>
            </div>

            <div class="detail-card">
              <div class="detail-label">차량 정보</div>
              <div class="detail-value">{{ relatedAsn?.status === 'REJECTED' ? '-' : (relatedAsn?.vehicleInfo || '-') }}</div>
            </div>

            <div class="detail-card">
              <div class="detail-label">담당자</div>
              <div class="detail-value">{{ relatedAsn?.contactName || '-' }}</div>
            </div>
          </div>
        </article>
      </section>

      <article class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">발주 품목</h2>
        </div>

        <div class="overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th class="px-6 py-4 text-left font-medium">상품</th>
                <th class="px-6 py-4 text-left font-medium">상품 코드</th>
                <th class="px-6 py-4 text-left font-medium">요청 수량</th>
                <th class="px-6 py-4 text-left font-medium">단가</th>
                <th class="px-6 py-4 text-left font-medium">금액</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in purchaseOrder.items || []"
                :key="item.productId"
                class="border-t border-slate-100 dark:border-slate-800"
              >
                <td class="px-6 py-5 font-medium text-slate-900 dark:text-slate-50">{{ item.productName }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ item.productCode }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ item.quantity }}개</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ formatPrice(item.unitPrice) }}</td>
                <td class="px-6 py-5 font-semibold text-slate-900 dark:text-slate-50">{{ formatPrice(item.quantity * item.unitPrice) }}</td>
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
import vendorPortalApi from '@/api/vendorPortal/vendorPortalApi.js'

const route = useRoute()
const router = useRouter()

const purchaseOrder = ref(null)
const relatedAsnDetail = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const relatedAsn = computed(() => relatedAsnDetail.value || null)

const totalAnnouncedQuantity = computed(() =>
  (relatedAsn.value?.items || []).reduce((sum, item) => sum + (item.announcedQuantity || 0), 0),
)

const replyMeta = computed(() => {
  if (!relatedAsn.value) {
    return { label: '미회신', color: 'warning' }
  }

  if (relatedAsn.value.status === 'REJECTED') {
    return { label: '회신불가', color: 'danger' }
  }

  return { label: '회신완료', color: 'success' }
})

const replyQuantitySummary = computed(() => {
  if (!relatedAsn.value) {
    return `0개 / ${purchaseOrder.value?.totalQuantity || 0}개`
  }

  if (relatedAsn.value.status === 'REJECTED') {
    return '회신불가'
  }

  return `${totalAnnouncedQuantity.value}개 / ${purchaseOrder.value?.totalQuantity || 0}개`
})

const summaryCards = computed(() => [
  {
    title: '총 품목 수',
    value: `${purchaseOrder.value?.itemCount ?? purchaseOrder.value?.items?.length ?? 0}종`,
    description: '발주서에 포함된 품목 수',
  },
  {
    title: '총 요청 수량',
    value: `${purchaseOrder.value?.totalQuantity || 0}개`,
    description: '공급사에 요청한 총 수량',
  },
  {
    title: '총 금액',
    value: formatPrice(purchaseOrder.value?.totalAmount || 0),
    description: '발주 요청 금액',
  },
  {
    title: 'ASN 상태',
    value: replyMeta.value.label,
    description: '현재 회신 진행 상태',
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

const formatPrice = (value) => new Intl.NumberFormat('ko-KR').format(Number(value || 0)) + '원'

const loadPage = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const [purchaseOrderRes, asnRes] = await Promise.all([
    vendorPortalApi.getPurchaseOrderDetail(route.params.id),
    vendorPortalApi.getAsnByPurchaseOrderId(route.params.id),
  ])

  if (!purchaseOrderRes.success) {
    purchaseOrder.value = null
    errorMessage.value = purchaseOrderRes.message || '발주 요청 상세 조회에 실패했습니다.'
    isLoading.value = false
    return
  }

  if (!asnRes.success) {
    purchaseOrder.value = purchaseOrderRes.results
    relatedAsnDetail.value = null
    isLoading.value = false
    return
  }

  purchaseOrder.value = purchaseOrderRes.results
  relatedAsnDetail.value = asnRes.results || null

  isLoading.value = false
}

const goReply = () => {
  router.push({
    name: 'asnVendorPortal',
    params: { id: String(route.params.id) },
  })
}

const goAsnDetail = () => {
  router.push({
    name: 'vendorAsnWorkspace',
    params: { id: String(route.params.id) },
  })
}

onMounted(loadPage)
</script>

<style scoped>
.detail-card {
  @apply rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950;
}

.detail-label {
  @apply text-sm font-medium text-slate-500 dark:text-slate-400;
}

.detail-value {
  @apply mt-2 text-base font-semibold text-slate-900 dark:text-slate-50;
}
</style>
