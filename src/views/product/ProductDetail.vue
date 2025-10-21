<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">상품 상세</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">상품 코드 {{ product?.productCode }}</p>
        </div>
        <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">뒤로가기</ButtonComp>
      </div>
    </template>

    <section
      v-if="product"
      class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
             rounded-xl shadow-sm p-6 md:p-8 space-y-8"
    >
      <div class="grid md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <div>
            <h2 class="font-semibold text-slate-700">상품명</h2>
            <p>{{ product.name }}</p>
          </div>

          <div>
            <h2 class="font-semibold text-slate-700">브랜드</h2>
            <p>{{ product.vendor?.name ?? '자체 생산' }}</p>
          </div>

          <div>
            <h2 class="font-semibold text-slate-700">단가</h2>
            <p>{{ product.unitPrice.toLocaleString() }} 원</p>
          </div>

          <div>
            <h2 class="font-semibold text-slate-700">유닛 (박스당 낱개 수)</h2>
            <p>{{ product.unit }}</p>
          </div>

          <div>
            <h2 class="font-semibold text-slate-700">비고</h2>
            <p>{{ product.description || '-' }}</p>
          </div>

          <div>
            <h2 class="font-semibold text-slate-700">상태</h2>
            <BadgeComp :color="getStatusColor(product.status)">
              {{ getStatusLabel(product.status) }}
            </BadgeComp>
          </div>
        </div>

        <div class="flex justify-center items-start">
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            alt="상품 이미지"
            class="rounded-lg shadow-md max-w-xs"
          />
          <div v-else class="text-slate-500 text-sm mt-4">이미지가 없습니다</div>
        </div>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'

const route = useRoute()
const product = ref(null)

const fetchProductDetail = async () => {
  const res = await axios.get(`/api/products/${route.params.id}`)
  product.value = res.data.results
}

const getStatusLabel = (status) =>
  ({ ACTIVE: '활성', INACTIVE: '품절', DISCONTINUED: '단종' }[status] || '-')

const getStatusColor = (status) =>
  ({ ACTIVE: 'green', INACTIVE: 'gray', DISCONTINUED: 'red' }[status] || 'gray')

onMounted(fetchProductDetail)
</script>
