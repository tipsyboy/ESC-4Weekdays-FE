<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">ASN Detail</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{{ asn?.asnNumber || 'ASN 상세' }}</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {{ asn?.purchaseOrderNumber || '-' }} · {{ statusMeta(asn?.status).label }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="router.push('/asns')">목록으로</ButtonComp>
        </div>
      </div>
    </template>

    <section v-if="asn" class="grid grid-cols-1 gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
      <div class="space-y-6">
        <article class="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div class="bg-gradient-to-r from-sky-900 via-cyan-800 to-slate-900 px-6 py-6 text-white">
            <div class="flex flex-wrap items-start gap-4">
              <div>
                <h2 class="text-2xl font-bold">{{ asn.vendorName }}</h2>
                <p class="mt-2 max-w-2xl text-sm text-white/75">{{ asn.note || '등록된 메모가 없습니다.' }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">발주서</div>
              <button
                type="button"
                class="mt-2 text-left text-lg font-semibold text-slate-900 transition hover:text-emerald-600 dark:text-slate-50 dark:hover:text-emerald-300"
                @click="router.push(`/purchase-orders/${asn.purchaseOrderId}`)"
              >
                {{ asn.purchaseOrderNumber }}
              </button>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">출하 담당자</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ asn.contactName || '-' }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">도착 예정</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ formatDateTime(asn.expectedArrivalAt) }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">차량 정보</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ asn.vehicleInfo || '-' }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">출하 담당자 연락처</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ asn.contactPhoneNumber || asn.vendorPhoneNumber || '-' }}</div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">ASN 품목</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">공급업체가 회신한 출하 예정 수량입니다.</p>
          </div>

          <div class="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th class="px-5 py-4 text-left font-medium">상품</th>
                  <th class="px-5 py-4 text-left font-medium">회신 수량</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in asn.items" :key="item.productCode" class="border-t border-slate-100 dark:border-slate-800">
                  <td class="px-5 py-4">
                    <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.productName }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.productCode }}</div>
                  </td>
                  <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ item.announcedQuantity }}개</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <div class="space-y-6">
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="space-y-5">
            <div class="rounded-2xl border p-5" :class="primaryAction.cardClass">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-medium text-slate-500 dark:text-slate-400">현재 상태</span>
                <BadgeComp :color="statusMeta(asn.status).color" :label="statusMeta(asn.status).label" />
              </div>
              <div class="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">{{ primaryAction.title }}</div>

              <div class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div v-if="linkedInbound" class="mt-2">
                  <div class="text-base font-semibold text-slate-900 dark:text-slate-50">{{ linkedInbound.inboundNumber }}</div>
                  <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {{ linkedInbound.receivedQuantity }}/{{ linkedInbound.expectedQuantity }}개
                  </div>
                </div>
                <div v-else class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  아직 연결된 입고 건이 없습니다.
                </div>
              </div>

              <div class="mt-4">
                <ButtonComp :color="primaryAction.color" :icon="primaryAction.icon" @click="handlePrimaryAction">
                  {{ primaryAction.label }}
                </ButtonComp>
              </div>
            </div>

          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">처리 메모</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">입고 담당자에게 전달할 참고 사항</p>
          </div>

          <div class="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            {{ asn.note || '등록된 메모가 없습니다.' }}
          </div>
        </article>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import asnApi from '@/api/asn/asnApi.js'
import inboundApi from '@/api/inbound/inboundApi.js'

const route = useRoute()
const router = useRouter()
const asn = ref(null)
const linkedInbound = ref(null)

const statusMeta = (status) => {
  const map = {
    WAITING: { label: '대기', color: 'info' },
    RECEIVED: { label: '확인', color: 'warning' },
    REJECTED: { label: '회신불가', color: 'danger' },
    SCHEDULED: { label: '입고예정', color: 'success' },
  }

  return map[status] || map.WAITING
}

const formatDateTime = (value) => {
  if (!value) return '-'

  return String(value)
    .replace('T', ' ')
    .slice(0, 16)
}

const primaryAction = computed(() => {
  if (!asn.value) {
    return {
      title: '-',
      label: '목록으로 이동',
      icon: 'list_alt',
      color: 'secondary',
      cardClass: 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40',
      type: 'route',
    }
  }

  if (asn.value.status === 'WAITING') {
    return {
      title: '공급업체 회신 정보가 아직 확정되지 않았습니다.',
      label: '목록으로 이동',
      icon: 'list_alt',
      color: 'secondary',
      cardClass: 'border-sky-200 bg-sky-50 dark:border-sky-900/60 dark:bg-sky-950/20',
      type: 'list',
    }
  }

  if (asn.value.status === 'REJECTED') {
    return {
      title: '공급업체가 발주 대응 불가를 회신했습니다.',
      label: '발주서 보기',
      icon: 'receipt_long',
      color: 'secondary',
      cardClass: 'border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/20',
      type: 'route',
    }
  }

  if (linkedInbound.value?.id) {
    return {
      title: '생성된 입고서 확인',
      label: '입고서 보기',
      icon: 'arrow_forward',
      color: 'secondary',
      cardClass: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20',
      type: 'route',
    }
  }

  return {
    title: '입고서 자동 생성 여부를 다시 확인해주세요.',
    label: '새로고침',
    icon: 'refresh',
    color: 'secondary',
    cardClass: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20',
    type: 'refresh',
  }
})

const loadAsn = async () => {
  const [asnRes, inboundRes] = await Promise.all([
    asnApi.getAsnDetail(route.params.id),
    inboundApi.getInboundByAsnId(route.params.id),
  ])

  asn.value = asnRes.results || null
  linkedInbound.value = inboundRes.success ? inboundRes.results : null
}

const changeStatus = async (status) => {
  const res = await asnApi.updateAsnStatus(route.params.id, status)
  if (!res.success) {
    alert(res.message || '상태 변경에 실패했습니다.')
    return
  }

  asn.value = res.results
}

const goInbound = () => {
  if (linkedInbound.value?.id) {
    router.push(`/inbounds/${linkedInbound.value.id}`)
  }
}

const handlePrimaryAction = async () => {
  if (primaryAction.value.type === 'refresh') {
    await loadAsn()
    return
  }

  if (primaryAction.value.type === 'list') {
    router.push('/asns')
    return
  }

  if (asn.value?.status === 'REJECTED') {
    router.push(`/purchase-orders/${asn.value.purchaseOrderId}`)
    return
  }

  goInbound()
}

onMounted(loadAsn)
</script>
