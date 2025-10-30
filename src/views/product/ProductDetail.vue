<template>
  <AppPageLayout>
    <!-- 헤더 -->
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">상품 상세</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            상품 코드 {{ product?.productCode || '-' }}
          </p>
        </div>

        <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">
          뒤로가기
        </ButtonComp>
      </div>
    </template>

    <!-- 상세 내용 -->
    <section
      v-if="product"
      class="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-gray-700
             rounded-2xl shadow-sm p-8 space-y-10"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">기본 정보</h2>

      <div class="grid md:grid-cols-2 gap-x-10 gap-y-6 text-sm text-gray-700 dark:text-gray-200">
        <div>
          <p class="font-medium text-gray-500 dark:text-gray-400">상품명</p>
          <p class="mt-1">{{ product.name || '-' }}</p>
        </div>

        <div>
          <p class="font-medium text-gray-500 dark:text-gray-400">브랜드 / 공급업체</p>
          <p class="mt-1">{{ product.vendor?.name ?? '자체 생산' }}</p>
        </div>

        <div>
          <p class="font-medium text-gray-500 dark:text-gray-400">단가</p>
          <p class="mt-1">{{ formatPrice(product.unitPrice) }} 원</p>
        </div>

        <div>
          <p class="font-medium text-gray-500 dark:text-gray-400">유닛 (박스당 낱개 수)</p>
          <p class="mt-1">{{ product.unit || '-' }}</p>
        </div>

        <div>
          <p class="font-medium text-gray-500 dark:text-gray-400">상태</p>
          <p class="mt-1">
            <BadgeComp
              :color="getStatusColor(product.status)"
              :label="getStatusLabel(product.status)"
            />
          </p>
        </div>

        <div class="md:col-span-2">
          <p class="font-medium text-gray-500 dark:text-gray-400">비고</p>
          <p class="mt-1 whitespace-pre-wrap">{{ product.description || '-' }}</p>
        </div>
      </div>
    </section>

    <!-- 이미지 카드 -->
    <section
      v-if="product"
      class="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-gray-700
             rounded-2xl shadow-sm p-8 text-center"
    >
      <h2 class="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">상품 이미지</h2>

      <div class="flex justify-center">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          alt="상품 이미지"
          class="rounded-lg shadow-md max-w-xs border border-gray-200 dark:border-gray-700"
        />
        <p v-else class="text-slate-500 dark:text-slate-400 text-sm mt-4">
          등록된 이미지가 없습니다.
        </p>
      </div>
    </section>

    <div v-else class="text-center py-20 text-slate-500 dark:text-slate-400">
      데이터를 불러오는 중입니다...
    </div>
  </AppPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import ProductApi from '@/api/product/index.js'

const route = useRoute()
const product = ref(null)

// 단가 포맷
const formatPrice = (value) => {
  if (!value || isNaN(value)) return '-'
  return value.toLocaleString('ko-KR')
}

// 상태 라벨
const getStatusLabel = (status) =>
  ({ ACTIVE: '활성', INACTIVE: '품절', DISCONTINUED: '단종' }[status] || '미정')

// 상태 색상
const getStatusColor = (status) =>
  ({ ACTIVE: 'success', INACTIVE: 'gray', DISCONTINUED: 'danger' }[status] || 'gray')

// 상품 상세 조회
const fetchProductDetail = async () => {
  const res = await ProductApi.productDetail(route.params.id)
  product.value = res?.results || null
}

onMounted(fetchProductDetail)
</script>
