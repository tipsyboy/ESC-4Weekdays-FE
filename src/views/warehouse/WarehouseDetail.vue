<template>
  <AppPageLayout>
    <!-- 상단 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
            {{ warehouse?.name || '물류창고 상세정보' }}
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            창고 ID: {{ warehouse?.id || '-' }}
          </p>
        </div>

        <div class="flex gap-2">
          <ButtonComp color="secondary" icon="arrow_back" @click="$router.push({ name: 'warehouseList' })">
            뒤로가기
          </ButtonComp>
          <ButtonComp color="primary" icon="edit" @click="editWarehouse">
            수정
          </ButtonComp>
        </div>
      </div>
    </template>

    <!-- 상세 정보 -->
    <section v-if="warehouse" class="space-y-8">
      <!-- 기본 정보 -->
      <div
          class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
             rounded-xl shadow-sm p-6 backdrop-blur-sm"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">기본 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <div><span class="text-gray-500 text-sm block">창고 ID</span> {{ warehouse.id }}</div>
          <div><span class="text-gray-500 text-sm block">창고명</span> {{ warehouse.name }}</div>
          <div><span class="text-gray-500 text-sm block">연락처</span> {{ warehouse.phoneNumber || '-' }}</div>
          <div><span class="text-gray-500 text-sm block">이메일</span> {{ warehouse.email || '-' }}</div>
        </div>
      </div>

      <!-- 주소 정보 -->
      <div
          class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
             rounded-xl shadow-sm p-6 backdrop-blur-sm"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">주소 정보</h2>
        <div class="space-y-2">
          <div><span class="text-gray-500 text-sm block">우편번호</span> {{ warehouse.address?.zipcode || '-' }}</div>
          <div><span class="text-gray-500 text-sm block">도시</span> {{ warehouse.address?.city || '-' }}</div>
          <div><span class="text-gray-500 text-sm block">도로명 주소</span> {{ warehouse.address?.street || '-' }}</div>
          <div><span class="text-gray-500 text-sm block">상세주소</span> {{ warehouse.address?.detail || '-' }}</div>
          <div><span class="text-gray-500 text-sm block">국가 코드</span> {{ warehouse.address?.country || '-' }}</div>
        </div>
      </div>
    </section>

    <div v-else class="text-center text-gray-500 py-10">
      물류창고 정보를 불러오는 중입니다...
    </div>
  </AppPageLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import warehouseApi from '@/api/warehouse/index.js'

const route = useRoute()
const router = useRouter()
const warehouse = ref(null)

// ✅ 상세 조회
const getWarehouse = async () => {
  try {
    const res = await warehouseApi.warehouseRead(`${route.params.id}`)
    warehouse.value = (res.data?.results ?? res.results) || {}
  } catch (e) {
    console.error('물류창고 상세 조회 실패:', e)
  }
}

// ✅ 수정 이동
const editWarehouse = () => {
  router.push({ name: 'warehouseUpdate', params: { id: route.params.id } })
}

onMounted(getWarehouse)
</script>
