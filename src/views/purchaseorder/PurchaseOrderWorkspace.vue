<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Purchase Order Detail</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">
            {{ purchaseOrder?.purchaseOrderNumber || '발주 상세' }}
          </h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {{ purchaseOrder?.vendorName || '-' }} · {{ statusMeta(purchaseOrder?.status).label }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="router.push('/purchase-orders')">목록으로</ButtonComp>
          <ButtonComp v-if="purchaseOrder" color="secondary" icon="storefront" @click="router.push(`/vendors/${purchaseOrder.vendorId}`)">공급업체 보기</ButtonComp>
        </div>
      </div>
    </template>

    <section
      v-if="isLoading"
      class="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
    >
      발주 정보를 불러오는 중입니다.
    </section>

    <section
      v-else-if="loadError && !purchaseOrder"
      class="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-sm text-rose-700 shadow-sm dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
    >
      {{ loadError }}
    </section>

    <section v-else-if="purchaseOrder" class="space-y-5">
      <section class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="overflow-x-auto pb-1">
          <div class="flex min-w-[760px] items-start gap-0">
            <template v-for="(event, index) in timelineEvents" :key="event.key">
              <div class="flex min-w-0 flex-1 flex-col items-center">
                <div class="flex w-full items-center">
                  <div
                    v-if="index > 0"
                    class="h-1 flex-1 rounded-full"
                    :class="timelineConnectorClass(index - 1)"
                  />
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] bg-white text-white shadow-sm dark:bg-slate-900"
                    :class="timelineNodeClass(event)"
                  >
                    <span class="material-symbols-outlined text-[16px]">{{ event.icon }}</span>
                  </div>
                  <div
                    v-if="index < timelineEvents.length - 1"
                    class="h-1 flex-1 rounded-full"
                    :class="timelineConnectorClass(index)"
                  />
                </div>

                  <div class="mt-3 w-full px-2 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <div class="text-sm font-semibold text-slate-900 dark:text-slate-50">{{ event.title }}</div>
                      <span
                        class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        :class="timelineBadgeClass(event)"
                      >
                        {{ event.badgeLabel }}
                      </span>
                    </div>
                    <div class="mt-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">{{ event.date }}</div>
                  </div>
                </div>
              </template>
            </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-6 2xl:grid-cols-[1.08fr_0.92fr]">
      <div class="space-y-5">
        <article class="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div class="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 px-5 py-5 text-white">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold">{{ purchaseOrder.vendorName }}</h2>
                <div class="mt-2 text-sm text-white/75">{{ purchaseOrder.purchaseOrderNumber }}</div>
                <p class="mt-2 max-w-2xl text-sm text-white/75">{{ purchaseOrder.requestMemo || '요청 메모가 없습니다.' }}</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <BadgeComp :color="statusMeta(purchaseOrder.status).color" :label="statusMeta(purchaseOrder.status).label" />

                <div class="flex flex-wrap justify-end gap-2">
                  <ButtonComp
                    :color="primaryAction.color"
                    :icon="primaryAction.icon"
                    size="sm"
                    @click="handlePrimaryAction"
                  >
                    {{ primaryAction.label }}
                  </ButtonComp>
                  <ButtonComp
                    v-for="action in dangerActions"
                    :key="action.key"
                    color="secondary"
                    :icon="action.icon"
                    size="sm"
                    @click="changeStatus(action.status)"
                  >
                    {{ action.label }}
                  </ButtonComp>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">공급업체</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ purchaseOrder.vendorName }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">요청자</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ purchaseOrder.requesterName }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">승인자</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ purchaseOrder.approverName || '-' }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">요청일</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ formatDateTime(purchaseOrder.requestedAt) }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">예정 입고일</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ purchaseOrder.expectedInboundDate || '-' }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">발주 전달일</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ formatDateTime(purchaseOrder.orderedAt) }}</div>
            </div>
          </div>
        </article>

        <div
          v-if="loadError && purchaseOrder"
          class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
        >
          {{ loadError }}
        </div>

        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">발주 라인</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">상품별 요청 수량과 금액을 확인합니다.</p>
          </div>

          <div class="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th class="px-5 py-4 text-left font-medium">상품</th>
                  <th class="px-5 py-4 text-left font-medium">수량</th>
                  <th class="px-5 py-4 text-left font-medium">단가</th>
                  <th class="px-5 py-4 text-left font-medium">금액</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in purchaseOrder.items" :key="item.productId" class="border-t border-slate-100 dark:border-slate-800">
                  <td class="px-5 py-4">
                    <button
                      type="button"
                      class="font-medium text-slate-900 transition hover:text-emerald-600 dark:text-slate-50 dark:hover:text-emerald-300"
                      @click="router.push(`/products/${item.productId}`)"
                    >
                      {{ item.productName }}
                    </button>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.productCode }}</div>
                  </td>
                  <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ item.quantity }}개</td>
                  <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ formatPrice(item.unitPrice) }}</td>
                  <td class="px-5 py-4 font-semibold text-slate-900 dark:text-slate-50">{{ formatPrice(item.quantity * item.unitPrice) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <div class="space-y-5">
        <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">합계 및 연결 정보</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">발주 수량, 금액, 후속 ASN/입고 연결을 확인합니다.</p>
          </div>

          <div class="mt-5 grid grid-cols-1 gap-4">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">총 수량</div>
              <div class="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{{ purchaseOrder.totalQuantity }}개</div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">총 금액</div>
              <div class="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{{ formatPrice(purchaseOrder.totalAmount) }}</div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">연결된 ASN</div>
              <div class="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{{ relatedAsns.length }}건</div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">연결된 입고</div>
              <div class="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{{ relatedInbounds.length }}건</div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">후속 연결</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">발주 완료 이후 연결되는 ASN과 입고 흐름입니다.</p>
          </div>

          <div class="mt-5 grid grid-cols-1 gap-4">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="flex items-center justify-between">
                <div class="font-medium text-slate-900 dark:text-slate-50">ASN</div>
                <ButtonComp color="secondary" icon="arrow_forward" size="sm" @click="router.push('/asns')">ASN 탭</ButtonComp>
              </div>

              <div v-if="relatedAsns.length" class="mt-4 space-y-3">
                <button
                  v-for="item in relatedAsns"
                  :key="item.id"
                  type="button"
                  class="flex w-full items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                  @click="router.push(`/asns/${item.id}`)"
                >
                  <div>
                    <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.asnNumber }}</div>
                    <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ formatDateTime(item.expectedArrivalAt) }}</div>
                  </div>
                  <BadgeComp :color="asnStatusMeta(item.status).color" :label="asnStatusMeta(item.status).label" />
                </button>
              </div>

              <div
                v-else
                class="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
              >
                아직 연결된 ASN이 없습니다.
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="flex items-center justify-between">
                <div class="font-medium text-slate-900 dark:text-slate-50">입고</div>
                <ButtonComp color="secondary" icon="arrow_forward" size="sm" @click="router.push('/inbounds')">입고 탭</ButtonComp>
              </div>

              <div v-if="relatedInbounds.length" class="mt-4 space-y-3">
                <button
                  v-for="item in relatedInbounds"
                  :key="item.id"
                  type="button"
                  class="flex w-full items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                  @click="router.push(`/inbounds/${item.id}`)"
                >
                  <div>
                    <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.inboundNumber }}</div>
                    <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ formatDateTime(item.expectedInboundAt || item.receivedAt) }}</div>
                  </div>
                  <BadgeComp :color="inboundStatusMeta(item.status).color" :label="inboundStatusMeta(item.status).label" />
                </button>
              </div>

              <div
                v-else
                class="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
              >
                아직 연결된 입고가 없습니다.
              </div>
            </div>
          </div>
        </article>
      </div>
      </section>
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

const route = useRoute()
const router = useRouter()
const purchaseOrder = ref(null)
const relatedAsns = ref([])
const relatedInbounds = ref([])
const isLoading = ref(false)
const loadError = ref('')

const statusMeta = (status) => {
  const map = {
    DRAFT: { label: '작성중', color: 'gray' },
    APPROVAL_PENDING: { label: '승인대기', color: 'warning' },
    APPROVED: { label: '승인완료', color: 'success' },
    REJECTED: { label: '반려', color: 'danger' },
    CANCELED: { label: '취소', color: 'gray' },
    ORDERED: { label: '발주완료', color: 'primary' },
  }

  return map[status] || map.DRAFT
}

const asnStatusMeta = (status) => {
  if (status === 'NOTICE') return { label: '통보완료', color: 'primary' }
  if (status === 'ARRIVED') return { label: '도착완료', color: 'success' }
  return { label: '예정', color: 'warning' }
}

const inboundStatusMeta = (status) => {
  if (status === 'COMPLETED') return { label: '입고완료', color: 'success' }
  if (status === 'RECEIVING') return { label: '입고중', color: 'primary' }
  return { label: '입고예정', color: 'warning' }
}

const formatPrice = (value) => `${Number(value || 0).toLocaleString('ko-KR')}원`
const formatDateTime = (value) => value?.replace('T', ' ').slice(0, 16) || '-'
const timelineConnectorClass = (index) => {
  const nextEvent = timelineEvents.value[index + 1]
  return nextEvent?.stage === 'done'
    ? 'bg-emerald-500 dark:bg-emerald-600'
    : 'bg-slate-200 dark:bg-slate-700'
}
const timelineNodeClass = (event) => {
  if (event.stage === 'done') return 'border-emerald-200 bg-emerald-600 dark:border-emerald-900'
  if (event.stage === 'scheduled') return 'border-sky-200 bg-sky-500 dark:border-sky-900'
  return 'border-slate-200 bg-slate-400 dark:border-slate-700'
}
const timelineBadgeClass = (event) => {
  if (event.stage === 'done') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200'
  if (event.stage === 'scheduled') return 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200'
  return 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
}

const primaryAction = computed(() => {
  if (!purchaseOrder.value) {
    return {
      title: '-',
      description: '',
      label: '목록으로 이동',
      icon: 'list_alt',
      color: 'secondary',
      cardClass: 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40',
      type: 'route',
      route: '/purchase-orders',
    }
  }

  const status = purchaseOrder.value.status

  if (status === 'DRAFT') {
    return {
      title: '승인 요청 올리기',
      description: '작성중인 발주를 승인 대기 상태로 올립니다.',
      label: '승인대기로 변경',
      icon: 'approval',
      color: 'primary',
      cardClass: 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40',
      type: 'status',
      nextStatus: 'APPROVAL_PENDING',
    }
  }

  if (status === 'APPROVAL_PENDING') {
    return {
      title: '발주 요청 승인',
      description: '승인 완료 처리 후 실제 발주 전달 단계로 넘깁니다.',
      label: '승인완료',
      icon: 'check_circle',
      color: 'success',
      cardClass: 'border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/20',
      type: 'status',
      nextStatus: 'APPROVED',
    }
  }

  if (status === 'APPROVED') {
    return {
      title: '실제 발주 전달 완료 처리',
      description: '공급업체에 실제 발주서 전달을 마쳤다면 발주완료로 전환합니다.',
      label: '발주완료 처리',
      icon: 'forward_to_inbox',
      color: 'primary',
      cardClass: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20',
      type: 'status',
      nextStatus: 'ORDERED',
    }
  }

  if (status === 'ORDERED') {
    return {
      title: 'ASN 탭으로 이동',
      description: '발주 완료 이후에는 ASN에서 도착 예정과 회신 정보를 관리합니다.',
      label: 'ASN에서 이어서 관리',
      icon: 'arrow_forward',
      color: 'secondary',
      cardClass: 'border-sky-200 bg-sky-50 dark:border-sky-900/60 dark:bg-sky-950/20',
      type: 'route',
      route: '/asns',
    }
  }

  if (status === 'REJECTED') {
    return {
      title: '반려된 요청',
      description: '반려 사유를 확인하고 필요 시 새 발주를 다시 작성합니다.',
      label: '목록으로 이동',
      icon: 'list_alt',
      color: 'secondary',
      cardClass: 'border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/20',
      type: 'route',
      route: '/purchase-orders',
    }
  }

  return {
    title: '취소된 발주',
    description: '취소된 건은 추가 처리 없이 목록에서 추적합니다.',
    label: '목록으로 이동',
    icon: 'list_alt',
    color: 'secondary',
    cardClass: 'border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/20',
    type: 'route',
    route: '/purchase-orders',
  }
})

const dangerActions = computed(() => {
  if (!purchaseOrder.value) return []

  if (purchaseOrder.value.status === 'APPROVAL_PENDING') {
    return [
      { key: 'reject', label: '반려', icon: 'close', status: 'REJECTED' },
      { key: 'cancel', label: '취소', icon: 'cancel', status: 'CANCELED' },
    ]
  }

  if (['DRAFT', 'APPROVED'].includes(purchaseOrder.value.status)) {
    return [
      { key: 'cancel', label: '취소', icon: 'cancel', status: 'CANCELED' },
    ]
  }

  return []
})

const loadPurchaseOrder = async () => {
  isLoading.value = true
  loadError.value = ''

  const res = await purchaseOrderApi.getPurchaseOrderDetail(route.params.id)

  if (!res.success || !res.results) {
    purchaseOrder.value = null
    loadError.value = res.message || '발주 정보를 불러오지 못했습니다.'
    isLoading.value = false
    return
  }

  purchaseOrder.value = res.results

  // ASN/입고 API는 후속 도메인 이식 때 연결한다.
  relatedAsns.value = []
  relatedInbounds.value = []

  isLoading.value = false
}

const changeStatus = async (status) => {
  const res = await purchaseOrderApi.updatePurchaseOrderStatus(route.params.id, status)
  if (!res.success) {
    alert(res.message || '상태 변경에 실패했습니다.')
    return
  }

  await loadPurchaseOrder()
}

const handlePrimaryAction = async () => {
  if (primaryAction.value.type === 'status') {
    await changeStatus(primaryAction.value.nextStatus)
    return
  }

  router.push(primaryAction.value.route)
}

const timelineEvents = computed(() => {
  if (!purchaseOrder.value) return []

  return [
    {
      key: 'requested',
      title: '발주 요청 생성',
      date: formatDateTime(purchaseOrder.value.requestedAt || purchaseOrder.value.createdAt),
      icon: 'edit_note',
      stage: Boolean(purchaseOrder.value.requestedAt || purchaseOrder.value.createdAt) ? 'done' : 'pending',
      badgeLabel: Boolean(purchaseOrder.value.requestedAt || purchaseOrder.value.createdAt) ? '완료' : '대기',
    },
    {
      key: 'approved',
      title: '승인 처리',
      date: formatDateTime(purchaseOrder.value.approvedAt),
      icon: 'approval',
      stage: Boolean(purchaseOrder.value.approvedAt) ? 'done' : 'pending',
      badgeLabel: Boolean(purchaseOrder.value.approvedAt) ? '완료' : '대기',
    },
    {
      key: 'ordered',
      title: '실제 발주 전달',
      date: formatDateTime(purchaseOrder.value.orderedAt),
      icon: 'forward_to_inbox',
      stage: Boolean(purchaseOrder.value.orderedAt) ? 'done' : 'pending',
      badgeLabel: Boolean(purchaseOrder.value.orderedAt) ? '완료' : '대기',
    },
    {
      key: 'expected',
      title: '예정 입고일',
      date: purchaseOrder.value.expectedInboundDate || '-',
      icon: 'calendar_month',
      stage: Boolean(purchaseOrder.value.expectedInboundDate) ? 'scheduled' : 'pending',
      badgeLabel: Boolean(purchaseOrder.value.expectedInboundDate) ? '예정' : '미정',
    },
  ]
})

onMounted(loadPurchaseOrder)
</script>
