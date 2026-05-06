<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">상품 관리</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{{ product?.name || '상품 상세' }}</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ product?.productCode || '-' }}</p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="primary" icon="edit" @click="router.push(`/products/${route.params.id}/edit`)">수정</ButtonComp>
          <ButtonComp color="secondary" icon="arrow_back" @click="router.push('/products')">목록으로</ButtonComp>
        </div>
      </div>
    </template>

    <section v-if="product" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <article class="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div class="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 px-6 py-6 text-white">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold">{{ product.name }}</h2>
                <div class="mt-2 space-y-1 text-sm text-white/75">
                  <div>등록일: {{ formatDate(product.createdAt) }}</div>
                  <div>최종 수정일: {{ formatDate(product.updatedAt) }}</div>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusChipClass(product.status)"
                >
                  {{ statusMeta(product.status).label }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[0.72fr_1.28fr]">
            <div class="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">상품 이미지</div>
              <div class="mt-4 flex aspect-[4/5] items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-gradient-to-br from-zinc-100 via-white to-emerald-50 dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-950 dark:to-emerald-950/20">
                <div class="text-center">
                  <span class="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">image</span>
                  <div class="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">이미지 영역 예정</div>
                  <div class="mt-1 text-xs text-slate-400 dark:text-slate-500">상품 대표 이미지를 이 위치에 노출</div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">카테고리</div>
                <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ product.category }}</div>
              </div>
              <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">공급업체</div>
                <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ product.vendorName || '-' }}</div>
              </div>
              <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">단가</div>
                <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ formatPrice(product.unitPrice) }}</div>
              </div>
              <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">박스당 수량</div>
                <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ product.boxQuantity }} EA</div>
              </div>
              <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">현재 재고</div>
                <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ product.stockQuantity }}</div>
              </div>
              <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">안전재고</div>
                <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ product.safetyStock }}</div>
              </div>
              <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">리드타임</div>
                <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ product.leadTimeDays }}일</div>
              </div>
              <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">위치 정책</div>
                <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">입고 시 위치 확정</div>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">상품 메모</h3>
          </div>

          <div class="mt-5 space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">설명</div>
              <div class="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">
                {{ product.description || '등록된 설명이 없습니다.' }}
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {{ stockMeta.description }}
            </div>
          </div>
        </article>
      </div>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">연결 이력</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">상품 기준으로 최근 발주와 입고 흐름을 이 영역에서 확인할 예정입니다.</p>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            예정
          </span>
        </div>

        <div class="mt-5">
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              :class="connectionTab === 'purchaseOrders'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300'"
              @click="connectionTab = 'purchaseOrders'"
            >
              최근 발주
            </button>
            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              :class="connectionTab === 'inbounds'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300'"
              @click="connectionTab = 'inbounds'"
            >
              최근 입고
            </button>
          </div>

          <div
            v-if="connectionTab === 'purchaseOrders'"
            class="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-950"
          >
            <div class="text-sm font-medium text-slate-700 dark:text-slate-200">최근 발주서 연결 영역 예정</div>
            <div class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              나중에 최근 발주서 목록과 발주 상세 이동 링크를 이 위치에 추가합니다.
            </div>
          </div>

          <div
            v-else
            class="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-950"
          >
            <div class="text-sm font-medium text-slate-700 dark:text-slate-200">최근 입고 연결 영역 예정</div>
            <div class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              나중에 최근 입고 목록과 입고 상세 이동 링크를 이 위치에 추가합니다.
            </div>
          </div>
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
import productApi from '@/api/product/productApi.js'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const connectionTab = ref('purchaseOrders')

const statusMeta = (status) => {
  if (status === 'SELLING') return { label: '판매중', color: 'success' }
  if (status === 'PAUSED') return { label: '일시중지', color: 'warning' }
  return { label: '단종', color: 'gray' }
}

const statusChipClass = (status) => {
  if (status === 'SELLING') return 'bg-emerald-100 text-emerald-800'
  if (status === 'PAUSED') return 'bg-amber-100 text-amber-800'
  return 'bg-slate-200 text-slate-700'
}

const formatPrice = (value) => `${Number(value || 0).toLocaleString('ko-KR')}원`

const formatDate = (value) => {
  if (!value) return '-'
  return value.slice(0, 10)
}

const loadProduct = async () => {
  const res = await productApi.getProductDetail(route.params.id)
  product.value = res.results || null
}

onMounted(loadProduct)

const stockMeta = computed(() => {
  if (!product.value) {
    return { label: '-', description: '' }
  }

  if (product.value.stockQuantity <= 0) {
    return { label: '재고 없음', description: '현재 재고가 없습니다. 입고 또는 발주 검토가 바로 필요합니다.' }
  }

  if (product.value.stockQuantity <= product.value.safetyStock) {
    return { label: '주의', description: '안전재고 이하입니다. 보충 발주 또는 입고 예정 여부를 확인해야 합니다.' }
  }

  return { label: '정상', description: '현재 재고가 안전재고보다 높아 정상 운영 가능한 상태입니다.' }
})
</script>
