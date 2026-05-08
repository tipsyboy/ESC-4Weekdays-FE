<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Inbound Detail</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{{ inbound?.inboundNumber || '입고 상세' }}</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {{ inbound?.vendorName || '-' }} · {{ statusMeta(inbound?.status).label }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="router.push('/inbounds')">목록으로</ButtonComp>
        </div>
      </div>
    </template>

    <section v-if="inbound" class="grid min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
      <div class="min-w-0 space-y-6">
        <article class="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-800 px-6 py-6 text-white">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold">{{ inbound.vendorName }}</h2>
              </div>

              <div class="flex flex-col items-end gap-2">
                <div class="flex flex-wrap items-center justify-end gap-3">
                  <BadgeComp :color="statusMeta(inbound.status).color" :label="statusMeta(inbound.status).label" />
                </div>
                <div class="flex flex-wrap justify-end gap-2">
                  <ButtonComp :color="primaryAction.color" :icon="primaryAction.icon" :disabled="isSaving" @click="handlePrimaryAction">
                    {{ primaryAction.label }}
                  </ButtonComp>
                  <ButtonComp
                    v-for="action in secondaryActions"
                    :key="action.key"
                    color="secondary"
                    :icon="action.icon"
                    :disabled="isSaving"
                    @click="handleSecondaryAction(action)"
                  >
                    {{ action.label }}
                  </ButtonComp>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">발주서</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ inbound.purchaseOrderNumber }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">ASN</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ inbound.asnNumber }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">예정 일시</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ formatDateTime(inbound.expectedInboundAt) }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">도착 도크</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ inbound.dock }}</div>
            </div>
          </div>
        </article>

        <article class="min-w-0 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">입고 라인</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">예정 수량과 실제 수량, 불량 수량을 입력하고 바로 저장합니다.</p>
          </div>

          <div class="mt-5 hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60 2xl:block">
            <table class="w-full text-sm">
              <colgroup>
                <col class="w-[27%]">
                <col class="w-[12%]">
                <col class="w-[19%]">
                <col class="w-[10%]">
                <col class="w-[10%]">
                <col class="w-[22%]">
              </colgroup>
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th class="px-5 py-4 text-left font-medium">상품</th>
                  <th class="px-5 py-4 text-left font-medium">예정</th>
                  <th class="px-5 py-4 text-left font-medium">적치 위치</th>
                  <th class="px-5 py-4 text-left font-medium">실제</th>
                  <th class="px-5 py-4 text-left font-medium">불량</th>
                  <th class="px-5 py-4 text-left font-medium">메모</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in inbound.items"
                  :key="item.productCode"
                  class="border-t border-slate-100 dark:border-slate-800"
                >
                  <td class="px-5 py-4">
                    <div class="break-words font-medium leading-5 text-slate-900 dark:text-slate-50">{{ item.productName }}</div>
                    <div class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{{ item.productCode }}</div>
                  </td>
                  <td class="px-5 py-4">
                    <div class="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {{ item.expectedQuantity }}개
                    </div>
                  </td>
                  <td class="px-5 py-4">
                    <button
                      type="button"
                      :disabled="isCompleted"
                      class="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-left text-sm text-slate-700 outline-none transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/30 dark:disabled:bg-slate-900"
                      @click="openLocationPicker(item)"
                    >
                      <span class="truncate pr-2" :class="selectedLocationCode(item.productId) ? 'text-slate-900 dark:text-slate-50' : 'text-slate-400'">
                        {{ selectedLocationCode(item.productId) || '위치 선택' }}
                      </span>
                      <span class="material-symbols-outlined text-[18px] text-slate-400">grid_view</span>
                    </button>
                  </td>
                  <td class="px-5 py-4">
                    <input
                      v-model.number="receiptForm.items[item.productId].receivedQuantity"
                      type="number"
                      min="0"
                      :disabled="isCompleted"
                      class="h-11 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    />
                  </td>
                  <td class="px-5 py-4">
                    <input
                      v-model.number="receiptForm.items[item.productId].defectQuantity"
                      type="number"
                      min="0"
                      :disabled="isCompleted"
                      class="h-11 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    />
                  </td>
                  <td class="px-5 py-4">
                    <input
                      v-model.trim="receiptForm.items[item.productId].memo"
                      type="text"
                      :disabled="isCompleted"
                      class="h-11 w-full min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                      placeholder="검수 메모"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-5 grid grid-cols-1 gap-4 2xl:hidden">
            <article
              v-for="item in inbound.items"
              :key="`card-${item.productCode}`"
              class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="break-words font-semibold leading-5 text-slate-900 dark:text-slate-50">{{ item.productName }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.productCode }}</div>
                </div>
                <div class="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  예정 {{ item.expectedQuantity }}개
                </div>
              </div>

              <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_112px_112px]">
                <button
                  type="button"
                  :disabled="isCompleted"
                  class="flex h-11 min-w-0 items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-left text-sm text-slate-700 outline-none transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/30 dark:disabled:bg-slate-900"
                  @click="openLocationPicker(item)"
                >
                  <span class="truncate pr-2" :class="selectedLocationCode(item.productId) ? 'text-slate-900 dark:text-slate-50' : 'text-slate-400'">
                    {{ selectedLocationCode(item.productId) || '위치 선택' }}
                  </span>
                  <span class="material-symbols-outlined text-[18px] text-slate-400">grid_view</span>
                </button>

                <label class="block">
                  <span class="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">실제</span>
                  <input
                    v-model.number="receiptForm.items[item.productId].receivedQuantity"
                    type="number"
                    min="0"
                    :disabled="isCompleted"
                    class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  />
                </label>

                <label class="block">
                  <span class="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">불량</span>
                  <input
                    v-model.number="receiptForm.items[item.productId].defectQuantity"
                    type="number"
                    min="0"
                    :disabled="isCompleted"
                    class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  />
                </label>
              </div>

              <input
                v-model.trim="receiptForm.items[item.productId].memo"
                type="text"
                :disabled="isCompleted"
                class="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                placeholder="검수 메모"
              />
            </article>
          </div>
        </article>
      </div>

      <div class="min-w-0 space-y-6">
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">입고 메모</h3>
          </div>

          <div class="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
            {{ inbound.inboundMemo || '입고 설명이 없습니다.' }}
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">입고 처리</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">입고 시각과 검수 메모를 저장합니다.</p>
          </div>

          <div class="mt-5 space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">입고 시각</label>
              <input
                v-model="receiptForm.receivedAt"
                type="datetime-local"
                :disabled="isCompleted"
                class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">검수 메모</label>
              <textarea
                v-model.trim="receiptForm.inspectionMemo"
                rows="4"
                :disabled="isCompleted"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                placeholder="현장 검수 결과를 입력하세요"
              />
            </div>
          </div>
        </article>

      </div>
    </section>

    <InboundLocationPickerModal
      :is-open="locationPicker.isOpen"
      :locations="zoneGroupedLocationOptions"
      :map-locations="mapLocations"
      :product-id="locationPicker.productId"
      :selected-location-id="locationPicker.selectedLocationId"
      :product-name="locationPicker.productName"
      @close="closeLocationPicker"
      @select="selectLocationFromPicker"
    />
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import inboundApi from '@/api/inbound/inboundApi.js'
import inventoryApi from '@/api/inventory/inventoryApi.js'
import InboundLocationPickerModal from '@/views/inbound/InboundLocationPickerModal.vue'

const route = useRoute()
const router = useRouter()
const inbound = ref(null)
const locationOptions = ref([])
const mapLocations = ref([])
const isSaving = ref(false)
const locationPicker = ref({
  isOpen: false,
  productId: null,
  productName: '',
  selectedLocationId: null,
})
const receiptForm = ref({
  receivedAt: '',
  inspectionMemo: '',
  items: {},
})

const statusMeta = (status) => {
  const map = {
    PLANNED: { label: '입고예정', color: 'info' },
    RECEIVING: { label: '입고중', color: 'warning' },
    PARTIAL: { label: '부분입고', color: 'secondary' },
    COMPLETED: { label: '입고완료', color: 'success' },
  }

  return map[status] || map.PLANNED
}

const formatDateTime = (value) => {
  if (!value) return '-'

  return String(value)
    .replace('T', ' ')
    .slice(0, 16)
}

const toDateTimeLocal = (value) => {
  if (!value) return ''
  return String(value).slice(0, 16)
}

const syncReceiptForm = () => {
  if (!inbound.value) return

  receiptForm.value = {
    receivedAt: toDateTimeLocal(inbound.value.receivedAt),
    inspectionMemo: inbound.value.inspectionMemo || '',
    items: Object.fromEntries(
      (inbound.value.items || []).map((item) => [
        item.productId,
        {
          productId: item.productId,
          locationId: item.locationId ?? null,
          receivedQuantity: Number(item.receivedQuantity || 0),
          defectQuantity: Number(item.defectQuantity || 0),
          memo: item.memo || '',
        },
      ]),
    ),
  }
}

const loadInbound = async () => {
  const res = await inboundApi.getInboundDetail(route.params.id)
  if (!res.success) {
    alert(res.message || '입고 상세 조회에 실패했습니다.')
    return
  }

  inbound.value = res.results
  syncReceiptForm()
}

const loadLocations = async () => {
  const [locationsRes, mapRes] = await Promise.all([
    inventoryApi.getLocations(),
    inventoryApi.getInventoryMap(),
  ])

  locationOptions.value = locationsRes.success
    ? (locationsRes.results || []).filter((location) => location.zoneType === 'STORAGE' && location.usable)
    : []
  mapLocations.value = mapRes.success ? (mapRes.results || []) : []
}

onMounted(async () => {
  await Promise.all([loadInbound(), loadLocations()])
})

const isCompleted = computed(() => inbound.value?.status === 'COMPLETED')

const zoneGroupedLocationOptions = computed(() => locationOptions.value.slice().sort((a, b) => {
  if (a.zoneCode !== b.zoneCode) return a.zoneCode.localeCompare(b.zoneCode)
  if (a.rackCode !== b.rackCode) return a.rackCode.localeCompare(b.rackCode)
  return a.levelCode.localeCompare(b.levelCode)
}))

const selectedLocationCode = (productId) => {
  const locationId = receiptForm.value.items?.[productId]?.locationId
  if (locationId == null) return ''
  return locationOptions.value.find((location) => location.id === Number(locationId))?.locationCode || ''
}

const openLocationPicker = (item) => {
  if (isCompleted.value) return

  locationPicker.value = {
    isOpen: true,
    productId: item.productId,
    productName: item.productName,
    selectedLocationId: receiptForm.value.items?.[item.productId]?.locationId ?? null,
  }
}

const closeLocationPicker = () => {
  locationPicker.value = {
    isOpen: false,
    productId: null,
    productName: '',
    selectedLocationId: null,
  }
}

const selectLocationFromPicker = (locationId) => {
  if (locationPicker.value.productId == null) return

  receiptForm.value.items[locationPicker.value.productId].locationId = locationId
  locationPicker.value.selectedLocationId = locationId
}

const primaryAction = computed(() => {
  if (!inbound.value) {
    return {
      title: '-',
      description: '',
      label: '목록으로 이동',
      icon: 'list_alt',
      color: 'secondary',
      cardClass: 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40',
    }
  }

  if (inbound.value.status === 'PLANNED') {
    return {
      title: '입고 시작 처리',
      description: '도착 차량 확인 후 실제 입고 등록을 시작합니다.',
      label: '입고 시작',
      icon: 'play_arrow',
      color: 'primary',
      cardClass: 'border-sky-200 bg-sky-50 dark:border-sky-900/60 dark:bg-sky-950/20',
    }
  }

  if (inbound.value.status === 'RECEIVING') {
    return {
      title: '부분입고 또는 완료 처리',
      description: '상품별 실수량 확인 후 부분입고나 완료로 마감합니다.',
      label: '입고 완료 처리',
      icon: 'task_alt',
      color: 'primary',
      cardClass: 'border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/20',
    }
  }

  if (inbound.value.status === 'PARTIAL') {
    return {
      title: '잔여 입고 확인',
      description: '남은 수량이 도착하면 최종 입고완료로 변경합니다.',
      label: '입고 완료 처리',
      icon: 'task_alt',
      color: 'primary',
      cardClass: 'border-violet-200 bg-violet-50 dark:border-violet-900/60 dark:bg-violet-950/20',
    }
  }

  return {
    title: '재고 반영 준비 완료',
    description: '입고 완료 후 다음 단계는 재고 반영입니다.',
    label: '목록으로 이동',
    icon: 'list_alt',
    color: 'secondary',
    cardClass: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20',
  }
})

const secondaryActions = computed(() => {
  if (!inbound.value) return []

  if (inbound.value.status === 'RECEIVING') {
    return [
      { key: 'partial', label: '부분입고 처리', icon: 'difference' },
    ]
  }

  if (inbound.value.status === 'PARTIAL') {
    return [
      { key: 'receiving', label: '입고중으로 복귀', icon: 'refresh' },
    ]
  }

  return []
})

const buildReceiptPayload = (status) => ({
  status,
  receivedAt: receiptForm.value.receivedAt || null,
  inspectionMemo: receiptForm.value.inspectionMemo,
  items: Object.values(receiptForm.value.items).map((item) => ({
    productId: item.productId,
    locationId: item.locationId != null ? Number(item.locationId) : null,
    receivedQuantity: Number(item.receivedQuantity || 0),
    defectQuantity: Number(item.defectQuantity || 0),
    memo: item.memo || '',
  })),
})

const submitReceipt = async (status) => {
  if (!inbound.value || isCompleted.value) return

  if (status === 'COMPLETED') {
    const hasMissingLocation = Object.values(receiptForm.value.items).some((item) => item.locationId == null || item.locationId === '')
    if (hasMissingLocation) {
      alert('입고완료 처리 전 모든 품목의 적치 위치를 선택해야 합니다.')
      return
    }
  }

  isSaving.value = true
  const res = await inboundApi.updateInboundReceipt(inbound.value.id, buildReceiptPayload(status))
  isSaving.value = false

  if (!res.success) {
    alert(res.message || '입고 처리 저장에 실패했습니다.')
    return
  }

  inbound.value = res.results
  syncReceiptForm()
}

const handlePrimaryAction = async () => {
  if (!inbound.value) return

  if (inbound.value.status === 'PLANNED') {
    await submitReceipt('RECEIVING')
    return
  }

  if (['RECEIVING', 'PARTIAL'].includes(inbound.value.status)) {
    await submitReceipt('COMPLETED')
    return
  }

  router.push('/inbounds')
}

const handleSecondaryAction = async (action) => {
  if (action.key === 'partial') {
    await submitReceipt('PARTIAL')
    return
  }

  if (action.key === 'receiving') {
    await submitReceipt('RECEIVING')
  }
}
</script>
