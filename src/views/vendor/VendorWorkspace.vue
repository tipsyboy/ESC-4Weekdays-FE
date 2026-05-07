<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600">공급업체 관리</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{{ vendor?.name || '공급업체 상세' }}</h1>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="primary" icon="edit" @click="router.push(`/vendors/${route.params.id}/edit`)">수정</ButtonComp>
          <ButtonComp color="secondary" icon="arrow_back" @click="router.push('/vendors')">목록으로</ButtonComp>
        </div>
      </div>
    </template>

    <section v-if="vendor" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <article class="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-violet-900 px-6 py-6 text-white">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold">{{ vendor.name }}</h2>
                <div class="mt-2 space-y-1 text-sm text-white/75">
                  <div>등록일: {{ formatDate(vendor.createdAt) }}</div>
                  <div>최종 수정일: {{ formatDate(vendor.updatedAt) }}</div>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusChipClass(vendor.status)"
                >
                  {{ statusMeta(vendor.status).label }}
                </span>

                <div class="flex flex-wrap justify-end gap-2">
                  <ButtonComp
                    v-if="vendor.status === 'PENDING'"
                    color="primary"
                    icon="check_circle"
                    size="sm"
                    @click="changeStatus('TRADING')"
                  >
                    거래 승인
                  </ButtonComp>
                  <ButtonComp
                    v-if="vendor.status === 'TRADING'"
                    color="secondary"
                    icon="pause_circle"
                    size="sm"
                    @click="changeStatus('STOPPED')"
                  >
                    거래중지
                  </ButtonComp>
                  <ButtonComp
                    v-if="vendor.status === 'STOPPED'"
                    color="primary"
                    icon="play_circle"
                    size="sm"
                    @click="changeStatus('TRADING')"
                  >
                    거래 재개
                  </ButtonComp>
                  <ButtonComp
                    v-if="vendor.status !== 'PENDING'"
                    color="secondary"
                    icon="schedule"
                    size="sm"
                    @click="changeStatus('PENDING')"
                  >
                    거래대기
                  </ButtonComp>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">담당자명</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ vendor.managerName || '-' }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">연락처</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ vendor.phoneNumber || '-' }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 md:col-span-2">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">이메일</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ vendor.email || '-' }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">주소</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                {{ formatFullAddress(vendor.address) }}
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">거래 메모</h3>
          </div>

          <div class="mt-5 space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">설명</div>
              <div class="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">
                {{ vendor.description || '등록된 설명이 없습니다.' }}
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  확장 예정
                </span>
                <div class="font-medium text-slate-900 dark:text-slate-50">후속 지표 확장</div>
              </div>
              <div class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <div>- 평균 리드타임</div>
                <div>- 납품 지연 횟수</div>
                <div>- 불량률</div>
                <div>- 발주 대비 입고 정확도</div>
                <div>- 거래중지/재개 이력</div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="space-y-6">
        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">거래 현황</h3>
          </div>

          <div class="mt-6">
            <div class="flex flex-wrap gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <button
                v-for="tab in tradeTabs"
                :key="tab.key"
                type="button"
                class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
                :class="activeTradeTab === tab.key
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-zinc-100 dark:bg-zinc-950/60 dark:text-slate-300 dark:hover:bg-zinc-800'"
                @click="activeTradeTab = tab.key"
              >
                <span>{{ tab.label }}</span>
                <span
                  class="rounded-full px-2 py-0.5 text-[11px]"
                  :class="activeTradeTab === tab.key ? 'bg-white/20 text-white' : 'bg-zinc-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-300'"
                >
                  {{ tab.count }}
                </span>
              </button>
            </div>

            <div class="mt-5 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="flex items-center justify-between gap-3">
                <h4 class="text-base font-semibold text-slate-900 dark:text-slate-50">{{ activeTradeSection.title }}</h4>
                <span class="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-200">
                  {{ activeTradeSection.items.length }}건
                </span>
              </div>

              <div v-if="tradeLoading" class="mt-4 rounded-2xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-zinc-700 dark:text-slate-400">
                거래 현황을 불러오는 중입니다.
              </div>

              <div v-else-if="tradeError" class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-10 text-center text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
                {{ tradeError }}
              </div>

              <div v-else-if="activeTradeSection.items.length" class="mt-4 space-y-3">
                <div
                  v-for="item in activeTradeSection.items"
                  :key="item.id"
                  class="cursor-pointer rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800 dark:hover:bg-violet-950/20"
                  @click="goTradeDetail(item)"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.title }}</div>
                      <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.meta }}</div>
                    </div>
                    <span class="rounded-full px-2.5 py-1 text-[11px] font-semibold" :class="item.statusClass">
                      {{ item.statusLabel }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-else class="mt-4 rounded-2xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-zinc-700 dark:text-slate-400">
                조회된 {{ activeTradeSection.title }} 정보가 없습니다.
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import vendorApi from '@/api/vendor/vendorApi.js'

const route = useRoute()
const router = useRouter()
const vendor = ref(null)
const tradeLoading = ref(false)
const tradeError = ref('')
const linkedProducts = ref([])
const purchaseOrders = ref([])
const asnItems = ref([])
const inboundItems = ref([])

const statusMeta = (status) => {
  if (status === 'TRADING') return { label: '거래중', color: 'success' }
  if (status === 'PENDING') return { label: '거래대기', color: 'warning' }
  return { label: '거래중지', color: 'danger' }
}

const statusChipClass = (status) => {
  if (status === 'TRADING') return 'bg-emerald-100 text-emerald-800'
  if (status === 'PENDING') return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-100'
}

const loadVendor = async () => {
  const res = await vendorApi.getVendorDetail(route.params.id)
  vendor.value = res.results || null
}

const loadTradeData = async () => {
  tradeLoading.value = true
  tradeError.value = ''

  const [productsRes, purchaseOrdersRes, asnsRes, inboundsRes] = await Promise.all([
    vendorApi.getVendorProducts(route.params.id),
    vendorApi.getVendorPurchaseOrders(route.params.id),
    vendorApi.getVendorAsns(route.params.id),
    vendorApi.getVendorInbounds(route.params.id),
  ])

  linkedProducts.value = productsRes.success
    ? (productsRes.results || []).map((item) => ({
        id: item.id,
        title: item.name,
        meta: `${item.productCode} · ${item.category}`,
        statusLabel: productStatusLabel(item.status),
        statusClass: productStatusClass(item.status),
        to: `/products/${item.id}`,
      }))
    : []

  purchaseOrders.value = purchaseOrdersRes.success
    ? (purchaseOrdersRes.results?.content || []).map((item) => ({
        id: item.id,
        title: item.purchaseOrderNumber,
        meta: `${formatDate(item.requestedAt)} · 수량 ${formatNumber(item.totalQuantity)} / ${formatAmount(item.totalAmount)}`,
        statusLabel: purchaseOrderStatusLabel(item.status),
        statusClass: purchaseOrderStatusClass(item.status),
        to: `/purchase-orders/${item.id}`,
      }))
    : []

  asnItems.value = asnsRes.success
    ? (asnsRes.results?.content || []).map((item) => ({
        id: item.id,
        title: item.asnNumber,
        meta: `${formatDateTime(item.expectedArrivalAt)} · ${item.purchaseOrderNumber}`,
        statusLabel: asnStatusLabel(item.status),
        statusClass: asnStatusClass(item.status),
        to: `/asns/${item.id}`,
      }))
    : []

  inboundItems.value = inboundsRes.success
    ? (inboundsRes.results?.content || []).map((item) => ({
        id: item.id,
        title: item.inboundNumber,
        meta: `${formatDateTime(item.receivedAt || item.expectedInboundAt)} · ${item.purchaseOrderNumber}`,
        statusLabel: inboundStatusLabel(item.status),
        statusClass: inboundStatusClass(item.status),
        to: `/inbounds/${item.id}`,
      }))
    : []

  const failedMessages = [productsRes, purchaseOrdersRes, asnsRes, inboundsRes]
    .filter((res) => !res.success)
    .map((res) => res.message)
    .filter(Boolean)

  if (failedMessages.length) {
    tradeError.value = failedMessages[0]
  }

  tradeLoading.value = false
}

const changeStatus = async (status) => {
  if (!vendor.value) return

  const res = await vendorApi.updateVendorStatus(vendor.value.id, status)
  if (!res.success) {
    alert(res.message || '상태 변경에 실패했습니다.')
    return
  }

  vendor.value = res.results
}

const goTradeDetail = (item) => {
  if (!item?.to) return
  router.push(item.to)
}

const formatDateTime = (value) => {
  if (!value) return '-'
  return value.replace('T', ' ').slice(0, 16)
}

const formatDate = (value) => {
  if (!value) return '-'
  return value.slice(0, 10)
}

const formatNumber = (value) => Number(value || 0).toLocaleString('ko-KR')
const formatAmount = (value) => `${Number(value || 0).toLocaleString('ko-KR')}원`

const formatFullAddress = (address) => {
  if (!address) return '-'

  const parts = [
    address.zipcode && `(${address.zipcode})`,
    address.city,
    address.street,
    address.detail,
  ].filter(Boolean)

  return parts.length ? parts.join(' ') : '-'
}

const productStatusLabel = (status) => {
  if (status === 'SELLING') return '판매중'
  if (status === 'PAUSED') return '일시중지'
  return '단종'
}

const productStatusClass = (status) => {
  if (status === 'SELLING') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
  if (status === 'PAUSED') return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
  return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
}

const purchaseOrderStatusLabel = (status) => {
  const labels = {
    DRAFT: '임시저장',
    REQUESTED: '요청',
    APPROVED: '승인',
    ORDERED: '발주확정',
    REJECTED: '반려',
    CANCELED: '취소',
  }

  return labels[status] || status
}

const purchaseOrderStatusClass = (status) => {
  if (status === 'ORDERED') return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200'
  if (status === 'APPROVED') return 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200'
  if (status === 'REQUESTED') return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
  return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
}

const asnStatusLabel = (status) => {
  const labels = {
    SCHEDULED: '도착예정',
    RECEIVED: '도착완료',
  }

  return labels[status] || status
}

const asnStatusClass = (status) => {
  if (status === 'SCHEDULED') return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
  if (status === 'RECEIVED') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
  return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
}

const inboundStatusLabel = (status) => {
  const labels = {
    REQUESTED: '입고요청',
    PROCESSING: '입고중',
    COMPLETED: '입고완료',
  }

  return labels[status] || status
}

const inboundStatusClass = (status) => {
  if (status === 'COMPLETED') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
  if (status === 'PROCESSING') return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
  return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
}

onMounted(async () => {
  await loadVendor()
  await loadTradeData()
})

const activeTradeTab = ref('products')

const tradeTabs = computed(() => [
  { key: 'products', label: '상품', count: linkedProducts.value.length },
  { key: 'purchaseOrders', label: '발주', count: purchaseOrders.value.length },
  { key: 'asn', label: 'ASN', count: asnItems.value.length },
  { key: 'inbound', label: '입고', count: inboundItems.value.length },
])

const activeTradeSection = computed(() => {
  if (activeTradeTab.value === 'purchaseOrders') {
    return {
      title: '발주',
      items: purchaseOrders.value,
    }
  }

  if (activeTradeTab.value === 'asn') {
    return {
      title: 'ASN',
      items: asnItems.value,
    }
  }

  if (activeTradeTab.value === 'inbound') {
    return {
      title: '입고',
      items: inboundItems.value,
    }
  }

  return {
    title: '상품',
    items: linkedProducts.value,
  }
})

watch(
  () => route.params.id,
  async () => {
    await loadVendor()
    await loadTradeData()
  },
)
</script>
