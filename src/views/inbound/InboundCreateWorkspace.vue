<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Inbound Create</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">입고서 생성</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            ASN 회신 내용을 기준으로 입고서를 생성합니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="goBack">ASN 상세로</ButtonComp>
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
      v-else-if="errorMessage"
      class="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-sm text-rose-700 shadow-sm dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
    >
      {{ errorMessage }}
    </section>

    <section v-else-if="asn" class="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div class="space-y-6">
        <article class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">ASN 기본 정보</h2>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div class="info-card">
              <div class="info-label">ASN 번호</div>
              <div class="info-value">{{ asn.asnNumber }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">발주번호</div>
              <button
                type="button"
                class="info-value text-left transition hover:text-emerald-600 dark:hover:text-emerald-300"
                @click="router.push(`/purchase-orders/${asn.purchaseOrderId}`)"
              >
                {{ asn.purchaseOrderNumber }}
              </button>
            </div>
            <div class="info-card">
              <div class="info-label">공급업체</div>
              <div class="info-value">{{ asn.vendorName }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">현재 상태</div>
              <div class="mt-2">
                <BadgeComp :color="statusMeta(asn.status).color" :label="statusMeta(asn.status).label" />
              </div>
            </div>
            <div class="info-card">
              <div class="info-label">도착 예정</div>
              <div class="info-value">{{ formatDateTime(asn.expectedArrivalAt) }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">차량 정보</div>
              <div class="info-value">{{ asn.vehicleInfo || '-' }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">출하 담당자</div>
              <div class="info-value">{{ asn.contactName || '-' }}</div>
            </div>
            <div class="info-card md:col-span-2">
              <div class="info-label">출하 담당자 연락처</div>
              <div class="info-value">{{ asn.contactPhoneNumber || asn.vendorPhoneNumber || '-' }}</div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">입고 예정 품목</h2>
          </div>

          <div class="overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th class="px-6 py-4 text-left font-medium">상품명</th>
                  <th class="px-6 py-4 text-left font-medium">상품코드</th>
                  <th class="px-6 py-4 text-left font-medium">예정 수량</th>
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
      </div>

      <div class="space-y-6">
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">입고 생성 정보</h2>
          </div>

          <div class="mt-5 space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">도크</label>
              <input
                v-model.trim="form.dock"
                type="text"
                class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                placeholder="예: A-01"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">입고 메모</label>
              <textarea
                v-model.trim="form.inboundMemo"
                rows="5"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                placeholder="도크 배정, 주의사항 등을 입력하세요"
              />
            </div>
          </div>
          <div class="mt-2 flex flex-wrap gap-3">
            <ButtonComp color="secondary" icon="close" @click="goBack">취소</ButtonComp>
            <ButtonComp color="primary" icon="add_task" :disabled="isSaving" @click="submit">입고서 생성</ButtonComp>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="text-sm font-medium text-slate-500 dark:text-slate-400">회신 총수량</div>
          <div class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{{ totalAnnouncedQuantity }}개</div>
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
const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const form = ref({
  dock: '',
  inboundMemo: '',
})

const statusMeta = (status) => {
  const map = {
    WAITING: { label: '대기', color: 'info' },
    RECEIVED: { label: '확인', color: 'warning' },
    REJECTED: { label: '회신불가', color: 'danger' },
    SCHEDULED: { label: '입고예정', color: 'success' },
  }

  return map[status] || map.WAITING
}

const totalAnnouncedQuantity = computed(() =>
  (asn.value?.items || []).reduce((sum, item) => sum + Number(item.announcedQuantity || 0), 0),
)

const formatDateTime = (value) => {
  if (!value) return '-'

  return String(value)
    .replace('T', ' ')
    .slice(0, 16)
}

const goBack = () => {
  if (!route.query.asnId) {
    router.push('/asns')
    return
  }

  router.push(`/asns/${route.query.asnId}`)
}

const loadAsn = async () => {
  if (!route.query.asnId) {
    errorMessage.value = 'ASN 정보가 없습니다.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const [asnRes, inboundRes] = await Promise.all([
    asnApi.getAsnDetail(route.query.asnId),
    inboundApi.getInboundByAsnId(route.query.asnId),
  ])

  if (!asnRes.success) {
    errorMessage.value = asnRes.message || 'ASN 상세 조회에 실패했습니다.'
    isLoading.value = false
    return
  }

  if (inboundRes.success && inboundRes.results?.id) {
    router.replace(`/inbounds/${inboundRes.results.id}`)
    return
  }

  asn.value = asnRes.results
  isLoading.value = false
}

const submit = async () => {
  if (!route.query.asnId) {
    alert('ASN 정보가 없습니다.')
    return
  }

  if (!form.value.dock) {
    alert('도크를 입력해주세요.')
    return
  }

  isSaving.value = true
  const res = await inboundApi.createInbound({
    asnId: route.query.asnId,
    dock: form.value.dock,
    inboundMemo: form.value.inboundMemo,
  })
  isSaving.value = false

  if (!res.success) {
    alert(res.message || '입고 생성에 실패했습니다.')
    return
  }

  router.push(`/inbounds/${res.results.id}`)
}

onMounted(loadAsn)
</script>

<style scoped>
.info-card {
  @apply rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950;
}

.info-label {
  @apply text-xs font-semibold uppercase tracking-[0.16em] text-slate-400;
}

.info-value {
  @apply mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50;
}
</style>
