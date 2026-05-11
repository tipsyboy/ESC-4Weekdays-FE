<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Inventory Control</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">재고 현황</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            창고 맵 기반 화면은 유지하면서, 재고 목록과 요약은 실제 API 기준으로 확인합니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="sync" @click="refreshInventory">재고 새로고침</ButtonComp>
          <ButtonComp color="primary" icon="inventory">입고 반영 대기 보기</ButtonComp>
        </div>
      </div>
    </template>

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-4">
      <article
        v-for="card in summaryCards"
        :key="card.title"
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ card.title }}</span>
          <span class="material-symbols-outlined text-slate-400">{{ card.icon }}</span>
        </div>
        <div class="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-50">{{ card.value }}</div>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ card.description }}</p>
      </article>
    </section>

    <section class="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <article class="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200">
            <span class="material-symbols-outlined text-xl">notification_important</span>
          </div>
          <div>
            <h2 class="font-semibold text-slate-900 dark:text-slate-50">운영 알림</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">현재 재고 상태 기준</p>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div
            v-for="alert in operationalAlerts"
            :key="alert.title"
            class="rounded-2xl border px-4 py-3"
            :class="alert.class"
          >
            <div class="text-sm font-semibold">{{ alert.title }}</div>
            <div class="mt-1 text-2xl font-black">{{ alert.value }}</div>
            <div class="mt-1 text-xs opacity-75">{{ alert.description }}</div>
          </div>
        </div>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200">
            <span class="material-symbols-outlined text-xl">move_to_inbox</span>
          </div>
          <div>
            <h2 class="font-semibold text-slate-900 dark:text-slate-50">최근 입고 내역</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">재고에 마지막으로 반영된 입고 문서</p>
          </div>
        </div>

        <div v-if="recentInboundItems.length" class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <button
            v-for="item in recentInboundItems"
            :key="`${item.id}-${item.lastInboundCode}`"
            type="button"
            class="flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-900 dark:hover:bg-sky-950/50"
            @click="openPreview(item)"
          >
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">{{ item.productName }}</div>
              <div class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{{ item.lastInboundCode }}</div>
            </div>
            <div class="shrink-0 text-right">
              <div class="text-sm font-bold text-slate-900 dark:text-slate-50">{{ formatNumber(item.totalQuantity) }}</div>
              <div class="text-xs text-slate-400">{{ formatDateTime(item.lastInboundAt) }}</div>
            </div>
          </button>
        </div>

        <div v-else class="mt-4 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          아직 재고에 반영된 입고 문서가 없습니다.
        </div>
      </article>
    </section>

    <section class="mt-6 space-y-6">
        <article class="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <InventoryWarehouseMap
            :locations="locations"
            :map-locations="mapLocations"
            :active-location-code="activeLane?.locationCode || ''"
            @select-slot="selectBlueprintSlot"
          />
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div>
              <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">재고 목록</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">상품명, 코드, 위치 기준으로 찾고 현재 상태를 바로 확인합니다.</p>
            </div>

            <div class="flex flex-wrap gap-2">
              <input
                v-model.trim="searchText"
                type="text"
                class="h-11 w-64 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                placeholder="상품명 검색"
              />
              <select
                v-model="selectedStatus"
                class="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="ALL">전체 상태</option>
                <option value="NORMAL">정상</option>
                <option value="LOW">부족</option>
                <option value="OUT">품절</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th class="px-6 py-4 text-left font-medium">상품</th>
                  <th class="px-6 py-4 text-left font-medium">위치 수</th>
                  <th class="px-6 py-4 text-left font-medium">현재고</th>
                  <th class="px-6 py-4 text-left font-medium">가용/보류</th>
                  <th class="px-6 py-4 text-left font-medium">상태</th>
                  <th class="px-6 py-4 text-left font-medium">최근 입고</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in inventories"
                  :key="item.id"
                  class="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                  @click="openPreview(item)"
                >
                  <td class="px-6 py-5">
                    <div class="font-semibold text-slate-900 dark:text-slate-50">{{ item.productName }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.productCode }} · {{ item.vendorName }}</div>
                  </td>
                  <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ formatNumber(item.locationCount) }}곳</td>
                  <td class="px-6 py-5 font-semibold text-slate-900 dark:text-slate-50">{{ formatNumber(item.totalQuantity) }}</td>
                  <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ formatNumber(item.availableQuantity) }} / {{ formatNumber(item.holdQuantity) }}</td>
                  <td class="px-6 py-5">
                    <BadgeComp :color="statusMeta(item.status).badgeColor" :label="statusMeta(item.status).label" />
                  </td>
                  <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ item.lastInboundCode || '-' }}</td>
                </tr>
                <tr v-if="!inventories.length">
                  <td colspan="6" class="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    조회된 재고가 없습니다. 입고완료 처리 후 재고가 반영됩니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

    </section>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPreviewOpen"
        class="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px]"
        @click.self="closePreview"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <aside class="ml-auto flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">Inventory Preview</div>
                  <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{{ selectedInventory?.productName || '재고 요약' }}</h2>
                  <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {{ previewTitle }}
                  </p>
                </div>
                <button
                  type="button"
                  class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                  @click="closePreview"
                >
                  <span class="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              <div v-if="selectedInventory" class="space-y-6">
                <div class="rounded-[1.75rem] bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_60%,#38bdf8_100%)] p-5 text-white">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="text-xs uppercase tracking-[0.22em] text-white/70">{{ selectedLocationCode ? 'Location Inventory' : 'Product Inventory' }}</div>
                      <div class="mt-2 text-2xl font-bold">{{ selectedInventory.productName }}</div>
                      <div class="mt-2 text-sm text-white/75">{{ selectedInventory.productCode }} · {{ selectedInventory.vendorName }}</div>
                    </div>
                    <span
                      class="rounded-full px-3 py-1 text-xs font-semibold"
                      :class="statusMeta(selectedInventory.status).chipClass"
                    >
                      {{ statusMeta(selectedInventory.status).label }}
                    </span>
                  </div>

                  <div class="mt-5 grid grid-cols-3 gap-3">
                    <div class="rounded-2xl bg-white/10 p-4">
                      <div class="text-xs text-white/70">총 재고</div>
                      <div class="mt-2 text-2xl font-bold">{{ formatNumber(selectedInventory.totalQuantity) }}</div>
                    </div>
                    <div class="rounded-2xl bg-white/10 p-4">
                      <div class="text-xs text-white/70">가용</div>
                      <div class="mt-2 text-2xl font-bold">{{ formatNumber(selectedInventory.availableQuantity) }}</div>
                    </div>
                    <div class="rounded-2xl bg-white/10 p-4">
                      <div class="text-xs text-white/70">보류</div>
                      <div class="mt-2 text-2xl font-bold">{{ formatNumber(selectedInventory.holdQuantity) }}</div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div class="text-sm font-medium text-slate-500 dark:text-slate-400">위치 수</div>
                    <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ formatNumber(selectedInventory.locationCount) }}곳</div>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div class="text-sm font-medium text-slate-500 dark:text-slate-400">안전재고</div>
                    <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ formatNumber(selectedInventory.safetyStock) }}</div>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 dark:border-slate-800 dark:bg-slate-900">
                    <div class="text-sm font-medium text-slate-500 dark:text-slate-400">최근 입고 문서</div>
                    <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ selectedInventory.lastInboundCode || '-' }}</div>
                    <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ formatDateTime(selectedInventory.lastInboundAt) }}</div>
                  </div>
                </div>

                <div v-if="selectedLocationItems.length > 1" class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div>
                    <h3 class="font-semibold text-slate-900 dark:text-slate-50">{{ selectedLocationCode }} 위치 재고</h3>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">같은 위치에 있는 상품을 빠르게 확인합니다.</p>
                  </div>
                  <div class="mt-4 space-y-2">
                    <button
                      v-for="item in selectedLocationItems"
                      :key="item.id"
                      type="button"
                      class="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:hover:border-sky-900 dark:hover:bg-sky-950/30"
                      :class="selectedInventory?.id === item.id ? 'border-sky-400 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30' : ''"
                      @click="selectedInventory = item"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div>
                          <div class="font-semibold text-slate-900 dark:text-slate-50">{{ item.productName }}</div>
                          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.productCode }} · {{ item.vendorName }}</div>
                        </div>
                        <BadgeComp :color="statusMeta(item.status).badgeColor" :label="statusMeta(item.status).label" />
                      </div>
                    </button>
                  </div>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-semibold text-slate-900 dark:text-slate-50">빠른 판단</h3>
                      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">현재 수량 기준으로 다음 행동을 확인합니다.</p>
                    </div>
                    <BadgeComp :color="statusMeta(selectedInventory.status).badgeColor" :label="statusMeta(selectedInventory.status).label" />
                  </div>
                  <div class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    {{ previewAction }}
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-200 px-6 py-5 dark:border-slate-800">
              <div class="flex flex-wrap justify-end gap-3">
                <ButtonComp color="secondary" icon="close" @click="closePreview">닫기</ButtonComp>
                <ButtonComp color="primary" icon="open_in_new" :disabled="!selectedInventory" @click="goDetail(selectedInventory.id)">상세 페이지로 이동</ButtonComp>
              </div>
            </div>
          </aside>
        </Transition>
      </div>
    </Transition>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import inventoryApi from '@/api/inventory/inventoryApi.js'
import InventoryWarehouseMap from '@/views/inventory/InventoryWarehouseMap.vue'
import { inventoryStatusMeta } from '@/views/inventory/inventoryStatusMeta.js'

const router = useRouter()
const searchText = ref('')
const selectedStatus = ref('ALL')
const activeLane = ref(null)
const inventories = ref([])
const selectedInventory = ref(null)
const selectedLocationItems = ref([])
const selectedLocationCode = ref('')
const mapLocations = ref([])
const locations = ref([])
const isPreviewOpen = ref(false)

const loadInventories = async () => {
  const params = {}
  if (searchText.value) params.productName = searchText.value
  if (selectedStatus.value !== 'ALL') params.status = selectedStatus.value

  const res = await inventoryApi.getInventories(params)
  inventories.value = res.success ? res.results : []
  if (selectedInventory.value) {
    selectedInventory.value = inventories.value.find((item) => item.id === selectedInventory.value.id) || selectedInventory.value
  }
}

const loadInventoryMap = async () => {
  const res = await inventoryApi.getInventoryMap()
  mapLocations.value = res.success ? res.results : []
}

const loadLocations = async () => {
  const res = await inventoryApi.getLocations()
  locations.value = res.success ? res.results : []
}

const refreshInventory = async () => {
  await Promise.all([loadInventories(), loadInventoryMap(), loadLocations()])
}

onMounted(refreshInventory)

watch([searchText, selectedStatus], loadInventories)

const summaryCards = computed(() => [
  { title: '관리 SKU', value: `${inventories.value.length.toLocaleString('ko-KR')}`, description: '현재 재고가 반영된 SKU', icon: 'deployed_code' },
  { title: '가용 재고', value: `${inventories.value.reduce((sum, item) => sum + Number(item.availableQuantity || 0), 0).toLocaleString('ko-KR')}`, description: '출고 가능 수량 기준', icon: 'inventory_2' },
  { title: '주의 SKU', value: `${inventories.value.filter((item) => item.status !== 'NORMAL').length}`, description: '부족 또는 품절 상태 SKU', icon: 'warning' },
  { title: '사용 로케이션', value: `${inventories.value.reduce((sum, item) => sum + Number(item.locationCount || 0), 0).toLocaleString('ko-KR')}`, description: '현재 재고가 존재하는 위치 수', icon: 'grid_view' },
])

const recentInboundItems = computed(() => inventories.value
  .filter((item) => item.lastInboundCode)
  .slice()
  .sort((a, b) => String(b.lastInboundAt || '').localeCompare(String(a.lastInboundAt || '')))
  .slice(0, 4))

const operationalAlerts = computed(() => {
  const lowCount = inventories.value.filter((item) => item.status === 'LOW').length
  const outCount = inventories.value.filter((item) => item.status === 'OUT').length
  const holdQuantity = inventories.value.reduce((sum, item) => sum + Number(item.holdQuantity || 0), 0)

  return [
    {
      title: '부족 SKU',
      value: lowCount.toLocaleString('ko-KR'),
      description: '안전재고 이하',
      class: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100',
    },
    {
      title: '품절 SKU',
      value: outCount.toLocaleString('ko-KR'),
      description: '가용 재고 없음',
      class: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-100',
    },
    {
      title: '보류 수량',
      value: holdQuantity.toLocaleString('ko-KR'),
      description: '검수/분리 보관',
      class: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-100',
    },
  ]
})

const previewTitle = computed(() => {
  if (selectedLocationCode.value) {
    return `${selectedLocationCode.value} · ${selectedLocationItems.value.length} SKU`
  }

  return `${selectedInventory.value?.productCode || '-'} · ${selectedInventory.value?.vendorName || '-'}`
})

const previewAction = computed(() => {
  if (selectedInventory.value?.status === 'OUT') return '가용 재고가 없습니다. 입고 예정 건 또는 발주 연결 여부를 확인해야 합니다.'
  if (selectedInventory.value?.status === 'LOW') return '안전재고 이하입니다. 보충 입고 또는 발주 요청 검토가 필요합니다.'
  return '현재 재고는 정상 범위입니다. 위치별 재고 구성이 필요하면 상세 페이지에서 확인합니다.'
})

const statusMeta = (status) => inventoryStatusMeta[status] || inventoryStatusMeta.NORMAL

const formatNumber = (value) => Number(value || 0).toLocaleString('ko-KR')

const selectLane = async (lane) => {
  activeLane.value = lane
  selectedLocationCode.value = lane.locationCode

  const res = await inventoryApi.getInventories({ locationCode: lane.locationCode })
  selectedLocationItems.value = res.success ? res.results : []

  if (selectedLocationItems.value.length) {
    openPreview(selectedLocationItems.value[0])
  }
}

const selectBlueprintSlot = async (slot) => {
  if (!slot.inventory) {
    activeLane.value = { locationCode: slot.locationCode }
    selectedLocationCode.value = slot.locationCode
    selectedLocationItems.value = []
    isPreviewOpen.value = false
    return
  }

  await selectLane(slot.inventory)
}

const openPreview = (item) => {
  if (!selectedLocationItems.value.some((locationItem) => locationItem.id === item.id)) {
    selectedLocationItems.value = [item]
    selectedLocationCode.value = ''
    activeLane.value = null
  }

  selectedInventory.value = item
  isPreviewOpen.value = true
}

const closePreview = () => {
  isPreviewOpen.value = false
  selectedLocationCode.value = ''
  selectedLocationItems.value = []
}

const goDetail = (id) => {
  router.push(`/inventories/${id}`)
}

const formatDateTime = (value) => {
  if (!value) return '-'
  return value.replace('T', ' ').slice(0, 16)
}
</script>
