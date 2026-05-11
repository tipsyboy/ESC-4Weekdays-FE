<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Inventory Detail</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{{ inventory?.productName || '재고 상세' }}</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {{ inventory?.productCode || '-' }} · {{ inventory?.vendorName || '-' }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="router.push('/inventories')">목록으로</ButtonComp>
        </div>
      </div>
    </template>

    <section v-if="inventory" class="grid grid-cols-1 gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
      <div class="space-y-6">
        <article class="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div class="bg-[linear-gradient(135deg,#082f49_0%,#0f172a_45%,#0ea5e9_100%)] px-6 py-6 text-white">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div class="text-xs uppercase tracking-[0.22em] text-white/70">Product Inventory</div>
                <h2 class="mt-2 text-2xl font-bold">{{ inventory.productName }}</h2>
                <p class="mt-2 max-w-2xl text-sm text-white/75">
                  상품 기준 재고 요약과 위치/LOT 단위 재고 구성을 확인합니다.
                </p>
              </div>
              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                :class="statusMeta(inventory.status).chipClass"
              >
                {{ statusMeta(inventory.status).label }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">총 재고</div>
              <div class="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">{{ formatNumber(inventory.totalQuantity) }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">가용재고</div>
              <div class="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">{{ formatNumber(inventory.availableQuantity) }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">보류재고</div>
              <div class="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">{{ formatNumber(inventory.holdQuantity) }}</div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">위치/LOT 단위 재고</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">상품 기준 요약 아래 실제 보관 위치별 재고를 확인합니다.</p>
          </div>

          <div class="mt-5 overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th class="px-5 py-4 text-left font-medium">창고</th>
                  <th class="px-5 py-4 text-left font-medium">존/로케이션</th>
                  <th class="px-5 py-4 text-left font-medium">LOT</th>
                  <th class="px-5 py-4 text-left font-medium">총 재고</th>
                  <th class="px-5 py-4 text-left font-medium">가용/보류</th>
                  <th class="px-5 py-4 text-left font-medium">상태</th>
                  <th class="px-5 py-4 text-left font-medium">최근 입고</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="stock in inventory.stocks"
                  :key="stock.inventoryId"
                  class="border-t border-zinc-100 dark:border-zinc-800"
                >
                  <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ stock.warehouseCode }}</td>
                  <td class="px-5 py-4">
                    <div class="font-semibold text-slate-900 dark:text-slate-50">{{ stock.zoneCode }} Zone</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ stock.locationCode }}</div>
                  </td>
                  <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ stock.lotNumber || '-' }}</td>
                  <td class="px-5 py-4 font-semibold text-slate-900 dark:text-slate-50">{{ formatNumber(stock.quantity) }}</td>
                  <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ formatNumber(stock.availableQuantity) }} / {{ formatNumber(stock.holdQuantity) }}</td>
                  <td class="px-5 py-4">
                    <BadgeComp :color="statusMeta(stock.status).badgeColor" :label="statusMeta(stock.status).label" />
                  </td>
                  <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ stock.lastInboundCode || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <div class="space-y-6">
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">재고 판단</h3>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">수량과 안전재고 기준으로 계산된 상태입니다.</p>
            </div>
            <BadgeComp :color="statusMeta(inventory.status).badgeColor" :label="statusMeta(inventory.status).label" />
          </div>

          <div class="mt-5 space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">안전재고</div>
              <div class="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{{ formatNumber(inventory.safetyStock) }}</div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">후속 액션</div>
              <div class="mt-2 text-sm text-slate-700 dark:text-slate-300">{{ recommendedAction }}</div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">연결 기준</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">현재 1차 구현 기준</p>
          </div>

          <div class="mt-5 space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="font-medium text-slate-900 dark:text-slate-50">입고 추적</div>
              <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">DB에는 lastInbound를 저장하고, 화면에는 lastInboundCode를 응답으로 보여줍니다.</div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="font-medium text-slate-900 dark:text-slate-50">위치 관리</div>
              <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">warehouseCode, zoneCode, locationCode는 Location 엔티티 기준입니다.</div>
            </div>
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
import inventoryApi from '@/api/inventory/inventoryApi.js'
import { inventoryStatusMeta } from '@/views/inventory/inventoryStatusMeta.js'

const route = useRoute()
const router = useRouter()
const inventory = ref(null)

const loadInventory = async () => {
  const res = await inventoryApi.getInventoryDetail(route.params.id)
  inventory.value = res.success ? res.results : null
}

onMounted(loadInventory)

const statusMeta = (status) => inventoryStatusMeta[status] || inventoryStatusMeta.NORMAL
const formatNumber = (value) => Number(value || 0).toLocaleString('ko-KR')

const recommendedAction = computed(() => {
  if (inventory.value?.status === 'OUT') return '가용 재고가 없습니다. 발주 또는 입고 예정 건을 확인해야 합니다.'
  if (inventory.value?.status === 'LOW') return '안전재고 이하입니다. 보충 입고 또는 발주 연결을 검토해야 합니다.'
  return '현재 재고는 정상 범위입니다.'
})
</script>
