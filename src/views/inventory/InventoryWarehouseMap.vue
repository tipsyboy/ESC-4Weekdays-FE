<template>
  <div class="bg-slate-950 p-5">
    <div>
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3 text-slate-100">
        <div>
          <div class="text-xs uppercase tracking-[0.26em] text-sky-200/80">ICN Center Layout</div>
          <div class="mt-1 text-base font-semibold">{{ selectedZone === 'ALL' ? 'Zone summary map' : `${selectedZone} Zone rack view` }}</div>
        </div>
        <div class="flex flex-wrap gap-2 text-xs font-medium">
          <span class="rounded-full border border-slate-600 px-3 py-1 text-slate-300">빈 슬롯</span>
          <span class="rounded-full bg-sky-100 px-3 py-1 text-sky-800">정상</span>
          <span class="rounded-full bg-amber-100 px-3 py-1 text-amber-800">부족</span>
          <span class="rounded-full bg-rose-100 px-3 py-1 text-rose-800">품절</span>
        </div>
      </div>

      <div class="mb-4 flex flex-wrap gap-2">
        <button
          v-for="zone in zoneTabs"
          :key="zone"
          type="button"
          class="rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="selectedZone === zone ? 'bg-white text-slate-950' : 'border border-slate-600 text-slate-300 hover:bg-slate-800'"
          @click="selectedZone = zone"
        >
          {{ zone === 'ALL' ? '전체 구역' : `${zone} Zone` }}
        </button>
      </div>

      <div class="rounded-[1.5rem] border border-slate-700 bg-slate-900 p-4">
        <div v-if="selectedZone === 'ALL'">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <button
              v-for="zone in zoneSummaries"
              :key="zone.zoneCode"
              type="button"
              class="min-h-[150px] rounded-2xl border p-5 text-left transition hover:-translate-y-0.5"
              :class="zoneCardClass(zone)"
              @click="selectedZone = zone.zoneCode"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="text-5xl font-black leading-none">{{ zone.zoneCode }}</div>
                  <div class="mt-2 text-sm font-bold uppercase tracking-[0.18em] opacity-70">Zone</div>
                </div>
                <span class="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-slate-800">
                  {{ zone.statusLabel }}
                </span>
              </div>
              <div class="mt-6 grid grid-cols-3 gap-2 text-center">
                <div class="rounded-xl bg-white/50 px-2 py-2 dark:bg-slate-950/20">
                  <div class="text-lg font-black">{{ zone.occupiedCount }}</div>
                  <div class="text-[10px] font-semibold uppercase opacity-70">LOC</div>
                </div>
                <div class="rounded-xl bg-white/50 px-2 py-2 dark:bg-slate-950/20">
                  <div class="text-lg font-black">{{ zone.skuCount }}</div>
                  <div class="text-[10px] font-semibold uppercase opacity-70">SKU</div>
                </div>
                <div class="rounded-xl bg-white/50 px-2 py-2 dark:bg-slate-950/20">
                  <div class="text-lg font-black">{{ zone.attentionCount }}</div>
                  <div class="text-[10px] font-semibold uppercase opacity-70">주의</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div v-else>
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                @click="selectedZone = 'ALL'"
              >
                전체 구역
              </button>
              <div>
                <div class="text-2xl font-black text-white">{{ activeZoneSummary.zoneCode }} Zone</div>
                <div class="text-sm text-slate-400">
                  {{ activeZoneSummary.occupiedCount }} / {{ activeZoneSummary.slots.length }} 위치 사용 · {{ activeZoneSummary.skuCount }} SKU
                </div>
              </div>
            </div>
            <span class="rounded-full px-4 py-2 text-sm font-bold" :class="activeZoneSummary.badgeClass">
              {{ activeZoneSummary.statusLabel }}
            </span>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <button
              v-for="slot in activeZoneSummary.slots"
              :key="slot.locationCode"
              type="button"
              class="group min-h-[118px] rounded-2xl border p-4 text-left transition hover:-translate-y-0.5"
              :class="slotClass(slot)"
              :title="slotTitle(slot)"
              @click="$emit('select-slot', slot)"
            >
              <div class="flex h-full flex-col justify-between">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-xl font-black uppercase tracking-[0.12em]">{{ compactLocationCode(slot.locationCode) }}</div>
                    <div class="mt-1 text-xs font-semibold uppercase tracking-[0.16em] opacity-70">Rack Slot</div>
                  </div>
                  <span
                    class="h-3 w-3 shrink-0 rounded-full"
                    :class="slot.inventory ? statusDotClass(slot.inventory.status) : 'bg-slate-500/60'"
                  />
                </div>
                <div>
                  <div class="truncate text-sm font-bold">{{ slot.inventory?.representativeProductName || 'Empty Slot' }}</div>
                  <div class="mt-1 text-xs opacity-75">
                    {{ slot.inventory ? `${formatNumber(slot.inventory.availableQuantity)} 가용 · ${formatNumber(slot.inventory.holdQuantity)} 보류` : '재고 없음' }}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div>{{ zoneSummaryText }}</div>
          <div>구역 선택 → 랙 선택 → 위치 재고 패널 → 상세 페이지</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { inventoryStatusMeta } from '@/views/inventory/inventoryStatusMeta.js'

const props = defineProps({
  locations: {
    type: Array,
    default: () => [],
  },
  mapLocations: {
    type: Array,
    default: () => [],
  },
  activeLocationCode: {
    type: String,
    default: '',
  },
})

defineEmits(['select-slot'])

const selectedZone = ref('ALL')

const inventoryLocationMap = computed(() => props.mapLocations.reduce((acc, location) => {
  acc[location.locationCode] = location
  return acc
}, {}))

const locationsByZone = computed(() => props.locations.reduce((acc, location) => {
  if (!acc[location.zoneCode]) acc[location.zoneCode] = []
  acc[location.zoneCode].push(location)
  return acc
}, {}))

const zoneCodes = computed(() => [
  ...new Set([
    ...Object.keys(locationsByZone.value),
  ]),
])

const zoneTabs = computed(() => ['ALL', ...zoneCodes.value])

const zoneSlots = (zoneCode) => {
  const zoneLocations = (locationsByZone.value[zoneCode] || []).slice().sort((a, b) => a.locationCode.localeCompare(b.locationCode))

  return zoneLocations.map((location) => ({
    ...location,
    inventory: inventoryLocationMap.value[location.locationCode] || null,
  }))
}

const zoneSummaries = computed(() => zoneCodes.value.map((zoneCode) => {
  const slots = zoneSlots(zoneCode)
  const occupiedSlots = slots.filter((slot) => slot.inventory)
  const status = occupiedSlots.some((slot) => slot.inventory.status === 'OUT')
    ? 'OUT'
    : occupiedSlots.some((slot) => slot.inventory.status === 'LOW')
      ? 'LOW'
      : 'NORMAL'

  return {
    zoneCode,
    slots,
    occupiedCount: occupiedSlots.length,
    skuCount: occupiedSlots.reduce((sum, slot) => sum + Number(slot.inventory?.skuCount || 0), 0),
    attentionCount: occupiedSlots.filter((slot) => slot.inventory.status !== 'NORMAL').length,
    status,
    statusLabel: zoneStatusLabel(status),
    badgeClass: statusMeta(status).chipClass,
  }
}))

const activeZoneSummary = computed(() => zoneSummaries.value.find((zone) => zone.zoneCode === selectedZone.value) || zoneSummaries.value[0] || {
  zoneCode: '-',
  slots: [],
  occupiedCount: 0,
  skuCount: 0,
  attentionCount: 0,
  status: 'NORMAL',
  statusLabel: '정상',
  badgeClass: statusMeta('NORMAL').chipClass,
})

const zoneSummaryText = computed(() => {
  const activeZones = zoneSummaries.value.filter((zone) => zone.occupiedCount > 0)
  const summary = activeZones.map((zone) => `${zone.zoneCode} Zone ${zone.skuCount} SKU`).join(' · ')
  return summary || '입고완료 처리 후 재고 위치가 표시됩니다.'
})

const statusMeta = (status) => inventoryStatusMeta[status] || inventoryStatusMeta.NORMAL

const zoneStatusLabel = (status) => {
  if (status === 'OUT') return '품절 포함'
  if (status === 'LOW') return '주의'
  return '정상'
}

const statusDotClass = (status) => {
  if (status === 'LOW') return 'bg-amber-500'
  if (status === 'OUT') return 'bg-rose-500'
  return 'bg-sky-500'
}

const zoneCardClass = (zone) => {
  if (zone.status === 'OUT') return 'border-rose-200 bg-rose-100 text-rose-950 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-100'
  if (zone.status === 'LOW') return 'border-amber-200 bg-amber-100 text-amber-950 dark:border-amber-900 dark:bg-amber-950/70 dark:text-amber-100'
  return 'border-sky-200 bg-sky-100 text-slate-900 dark:border-sky-900 dark:bg-sky-950/70 dark:text-slate-100'
}

const slotClass = (slot) => {
  const selectedClass = props.activeLocationCode === slot.locationCode ? 'ring-2 ring-white/80 z-10' : ''

  if (!slot.inventory) {
    return ['border-slate-600 bg-slate-800/70 text-slate-500 hover:border-slate-500 hover:bg-slate-700/80', selectedClass]
  }

  return [statusMeta(slot.inventory.status).cellClass, selectedClass]
}

const slotTitle = (slot) => {
  if (!slot.inventory) return `${slot.locationCode} · 빈 슬롯`
  return `${slot.locationCode} · ${slot.inventory.representativeProductName || '상품 정보 없음'} · ${slot.inventory.skuCount} SKU`
}

const compactLocationCode = (locationCode) => locationCode.replace(/^([A-Z]+)-0?(\d+)-0?(\d+)$/, '$1-$2-$3')
const formatNumber = (value) => Number(value || 0).toLocaleString('ko-KR')
</script>
